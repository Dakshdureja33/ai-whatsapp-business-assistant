"""
Meta WhatsApp Webhook Routes.

Handles:
- Webhook verification (GET)
- Incoming message processing (POST)
- Message status updates
- Automation workflow triggers
"""

from fastapi import APIRouter, Request, Query, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from loguru import logger
from datetime import datetime
import json

from app.database import get_db
from app.config import get_settings
from app.models.models import (
    Contact, Conversation, Message, WebhookLog, FAQ,
    MessageDirection, MessageType, ConversationStatus, WorkflowTrigger, LeadStatus
)
from app.services.whatsapp_service import whatsapp_service
from app.services.ai_service import ai_service
from app.services.automation_service import automation_engine

settings = get_settings()
router = APIRouter(prefix="/webhook", tags=["WhatsApp Webhooks"])


@router.get("")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
):
    """
    Webhook verification endpoint for Meta.

    Meta sends a GET request with a verify token to confirm
    the webhook URL is valid and belongs to us.
    """
    logger.info(f"Webhook verification: mode={hub_mode}, token={hub_verify_token}")

    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        logger.info("Webhook verified successfully!")
        return int(hub_challenge) if hub_challenge else "OK"

    logger.warning("Webhook verification failed!")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("")
async def handle_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Process incoming WhatsApp webhook events.

    Handles:
    - Incoming customer messages
    - Message status updates (sent, delivered, read)
    - Triggers automation workflows
    - Generates AI responses
    """
    try:
        payload = await request.json()
        logger.info(f"Webhook received: {json.dumps(payload, indent=2)[:500]}")

        # Log the webhook
        webhook_log = WebhookLog(
            event_type="whatsapp_webhook",
            payload=payload,
        )
        db.add(webhook_log)

        # Parse messages from the webhook
        parsed_messages = whatsapp_service.parse_webhook_message(payload)

        for msg in parsed_messages:
            if msg.get("type") == "status_update":
                await _handle_status_update(msg, db)
            else:
                await _handle_incoming_message(msg, db)

        webhook_log.processed = True
        await db.commit()

        return {"status": "ok"}

    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def _handle_incoming_message(msg: dict, db: AsyncSession):
    """Process an incoming customer message."""

    phone_number = msg.get("from")
    content = msg.get("content", "")
    contact_name = msg.get("contact_name", "Unknown")
    wa_message_id = msg.get("message_id")

    if not phone_number or not content:
        return

    # 1. Find or create contact
    result = await db.execute(
        select(Contact).where(Contact.phone_number == phone_number)
    )
    contact = result.scalar_one_or_none()
    is_new_contact = False

    if not contact:
        is_new_contact = True
        contact = Contact(
            phone_number=phone_number,
            name=contact_name,
            lead_status=LeadStatus.NEW,
        )
        db.add(contact)
        await db.flush()

    # Update last message time
    contact.last_message_at = datetime.utcnow()

    # 2. Find or create conversation
    result = await db.execute(
        select(Conversation).where(
            Conversation.contact_id == contact.id,
            Conversation.status.in_([
                ConversationStatus.ACTIVE,
                ConversationStatus.AI_HANDLING,
                ConversationStatus.HUMAN_HANDLING,
            ])
        ).order_by(Conversation.created_at.desc())
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        conversation = Conversation(
            contact_id=contact.id,
            status=ConversationStatus.AI_HANDLING,
        )
        db.add(conversation)
        await db.flush()

    # 3. Save the incoming message
    message = Message(
        conversation_id=conversation.id,
        whatsapp_message_id=wa_message_id,
        direction=MessageDirection.INBOUND,
        message_type=MessageType.TEXT,
        content=content,
    )
    db.add(message)

    # Update conversation stats
    conversation.message_count += 1
    conversation.last_message_preview = content[:200]

    await db.flush()

    # 4. Trigger automation workflows
    if is_new_contact:
        await automation_engine.process_trigger(
            WorkflowTrigger.NEW_CONVERSATION,
            {
                "phone_number": phone_number,
                "contact_name": contact_name,
                "contact_id": str(contact.id),
                "conversation_id": str(conversation.id),
            },
            db,
        )
    else:
        # Check for keyword triggers
        await automation_engine.process_trigger(
            WorkflowTrigger.KEYWORD,
            {
                "phone_number": phone_number,
                "contact_name": contact_name,
                "contact_id": str(contact.id),
                "conversation_id": str(conversation.id),
                "message": content,
            },
            db,
        )

    # 5. Generate AI response if AI is handling
    if conversation.status == ConversationStatus.AI_HANDLING and conversation.is_ai_enabled:
        await _generate_and_send_ai_response(
            conversation, contact, content, db
        )

    # Mark message as read on WhatsApp
    if wa_message_id:
        await whatsapp_service.mark_as_read(wa_message_id)

    await db.commit()


async def _generate_and_send_ai_response(
    conversation: Conversation,
    contact: Contact,
    user_message: str,
    db: AsyncSession,
):
    """Generate an AI response and send it via WhatsApp."""

    # Fetch FAQs for context
    faq_result = await db.execute(
        select(FAQ).where(FAQ.is_active == True)
    )
    faqs = faq_result.scalars().all()
    faq_list = [{"question": f.question, "answer": f.answer} for f in faqs]

    # Detect intent and check for order queries
    intent = ai_service.detect_intent(user_message)
    order_info = None

    if intent == "order_tracking":
        from app.models.models import Order
        order_result = await db.execute(
            select(Order).where(Order.contact_id == contact.id).order_by(Order.created_at.desc())
        )
        order = order_result.scalar_one_or_none()
        if order:
            order_info = {
                "order_number": order.order_number,
                "status": order.status.value,
                "items": str(order.items),
                "tracking_number": order.tracking_number,
                "estimated_delivery": str(order.estimated_delivery) if order.estimated_delivery else None,
            }

    # Get conversation history
    msg_result = await db.execute(
        select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.desc()).limit(10)
    )
    history = [
        {"direction": m.direction.value, "content": m.content}
        for m in reversed(msg_result.scalars().all())
    ]

    # Generate AI response
    ai_response = await ai_service.generate_response(
        user_message=user_message,
        conversation_history=history,
        faqs=faq_list,
        order_info=order_info,
    )

    # Save AI response as outbound message
    outbound_msg = Message(
        conversation_id=conversation.id,
        direction=MessageDirection.OUTBOUND,
        message_type=MessageType.TEXT,
        content=ai_response,
        is_ai_generated=True,
    )
    db.add(outbound_msg)
    conversation.message_count += 1
    conversation.last_message_preview = ai_response[:200]

    # Update FAQ usage counts
    for faq in faqs:
        for keyword in (faq.keywords or []):
            if keyword.lower() in user_message.lower():
                faq.usage_count += 1
                break

    # Send via WhatsApp
    result = await whatsapp_service.send_text_message(contact.phone_number, ai_response)

    if result and not result.get("error"):
        wa_msg_id = result.get("messages", [{}])[0].get("id")
        if wa_msg_id:
            outbound_msg.whatsapp_message_id = wa_msg_id

    await db.flush()


async def _handle_status_update(msg: dict, db: AsyncSession):
    """Handle message status updates (sent, delivered, read)."""
    wa_message_id = msg.get("message_id")
    status = msg.get("status")

    if not wa_message_id:
        return

    result = await db.execute(
        select(Message).where(Message.whatsapp_message_id == wa_message_id)
    )
    message = result.scalar_one_or_none()

    if message:
        if status == "delivered":
            message.delivered_at = datetime.utcnow()
        elif status == "read":
            message.is_read = True
            message.read_at = datetime.utcnow()
