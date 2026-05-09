"""
Conversation & Chat Management API Routes.

Provides endpoints for:
- Listing conversations
- Viewing conversation messages
- Admin sending messages
- Taking over AI conversations
- Resolving conversations
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.models import (
    Conversation, Message, Contact,
    ConversationStatus, MessageDirection, MessageType
)
from app.schemas.schemas import (
    ConversationResponse, ConversationWithMessages,
    ConversationUpdate, MessageResponse, AdminChatMessage
)
from app.services.whatsapp_service import whatsapp_service

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=list[ConversationResponse])
async def list_conversations(
    status: ConversationStatus = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all conversations with optional status filter."""
    query = select(Conversation).options().order_by(desc(Conversation.updated_at))

    if status:
        query = query.where(Conversation.status == status)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    conversations = result.scalars().all()

    # Eagerly load contacts
    response = []
    for conv in conversations:
        contact_result = await db.execute(
            select(Contact).where(Contact.id == conv.contact_id)
        )
        contact = contact_result.scalar_one_or_none()

        conv_dict = {
            "id": conv.id,
            "contact_id": conv.contact_id,
            "status": conv.status,
            "subject": conv.subject,
            "is_ai_enabled": conv.is_ai_enabled,
            "message_count": conv.message_count,
            "last_message_preview": conv.last_message_preview,
            "started_at": conv.started_at,
            "resolved_at": conv.resolved_at,
            "created_at": conv.created_at,
            "contact": contact,
        }
        response.append(ConversationResponse(**conv_dict))

    return response


@router.get("/{conversation_id}", response_model=ConversationWithMessages)
async def get_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a single conversation with all its messages."""
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Load contact
    contact_result = await db.execute(
        select(Contact).where(Contact.id == conversation.contact_id)
    )
    contact = contact_result.scalar_one_or_none()

    # Load messages
    msg_result = await db.execute(
        select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())
    )
    messages = msg_result.scalars().all()

    return ConversationWithMessages(
        id=conversation.id,
        contact_id=conversation.contact_id,
        status=conversation.status,
        subject=conversation.subject,
        is_ai_enabled=conversation.is_ai_enabled,
        message_count=conversation.message_count,
        last_message_preview=conversation.last_message_preview,
        started_at=conversation.started_at,
        resolved_at=conversation.resolved_at,
        created_at=conversation.created_at,
        contact=contact,
        messages=[MessageResponse.model_validate(m) for m in messages],
    )


@router.patch("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: UUID,
    update: ConversationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update conversation (change status, toggle AI, etc)."""
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if update.status is not None:
        conversation.status = update.status
        if update.status == ConversationStatus.RESOLVED:
            conversation.resolved_at = datetime.utcnow()

    if update.subject is not None:
        conversation.subject = update.subject

    if update.is_ai_enabled is not None:
        conversation.is_ai_enabled = update.is_ai_enabled
        if update.is_ai_enabled:
            conversation.status = ConversationStatus.AI_HANDLING
        else:
            conversation.status = ConversationStatus.HUMAN_HANDLING

    await db.commit()
    await db.refresh(conversation)

    return ConversationResponse.model_validate(conversation)


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_admin_message(
    conversation_id: UUID,
    message: AdminChatMessage,
    db: AsyncSession = Depends(get_db),
):
    """Send a message as admin (human takeover)."""
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Get contact for phone number
    contact_result = await db.execute(
        select(Contact).where(Contact.id == conversation.contact_id)
    )
    contact = contact_result.scalar_one_or_none()

    # Save message
    msg = Message(
        conversation_id=conversation_id,
        direction=MessageDirection.OUTBOUND,
        message_type=MessageType.TEXT,
        content=message.content,
        is_ai_generated=False,
    )
    db.add(msg)

    # Update conversation
    conversation.message_count += 1
    conversation.last_message_preview = message.content[:200]
    conversation.status = ConversationStatus.HUMAN_HANDLING
    conversation.is_ai_enabled = False

    # Send via WhatsApp
    if contact:
        result = await whatsapp_service.send_text_message(
            contact.phone_number, message.content
        )
        if result and not result.get("error"):
            wa_msg_id = result.get("messages", [{}])[0].get("id")
            if wa_msg_id:
                msg.whatsapp_message_id = wa_msg_id

    await db.commit()
    await db.refresh(msg)

    return MessageResponse.model_validate(msg)
