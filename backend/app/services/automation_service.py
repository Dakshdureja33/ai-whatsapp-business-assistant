"""
Automation Workflow Engine.

Handles execution of automated WhatsApp workflows:
- Welcome messages for new conversations
- Lead capture flows
- Follow-up reminders
- Auto-reply when admins are offline
- Order confirmation messages
"""

from datetime import datetime
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.models.models import (
    AutomationWorkflow, WorkflowTrigger, Contact, Conversation,
    Message, MessageDirection, ConversationStatus
)
from app.services.whatsapp_service import whatsapp_service
from app.services.ai_service import ai_service
from app.config import get_settings

settings = get_settings()


class AutomationEngine:
    """Engine for executing automation workflows."""

    async def process_trigger(
        self, trigger: WorkflowTrigger, context: dict, db: AsyncSession
    ) -> list:
        """
        Process a workflow trigger and execute matching workflows.

        Args:
            trigger: The trigger type
            context: Trigger context data
            db: Database session

        Returns:
            List of execution results
        """
        # Fetch active workflows matching the trigger
        result = await db.execute(
            select(AutomationWorkflow).where(
                AutomationWorkflow.trigger == trigger,
                AutomationWorkflow.is_active == True
            )
        )
        workflows = result.scalars().all()

        results = []
        for workflow in workflows:
            try:
                execution_result = await self._execute_workflow(workflow, context, db)
                results.append({
                    "workflow_id": str(workflow.id),
                    "workflow_name": workflow.name,
                    "status": "success",
                    "result": execution_result,
                })

                # Update execution stats
                workflow.execution_count += 1
                workflow.last_executed_at = datetime.utcnow()
                await db.commit()

            except Exception as e:
                logger.error(f"Workflow {workflow.name} failed: {e}")
                results.append({
                    "workflow_id": str(workflow.id),
                    "workflow_name": workflow.name,
                    "status": "error",
                    "error": str(e),
                })

        return results

    async def _execute_workflow(
        self, workflow: AutomationWorkflow, context: dict, db: AsyncSession
    ) -> dict:
        """Execute a single workflow."""
        results = {}

        for action in workflow.actions:
            action_type = action.get("type")
            action_config = action.get("config", {})

            if action_type == "send_message":
                result = await self._action_send_message(action_config, context)
                results["send_message"] = result

            elif action_type == "send_welcome":
                result = await self._action_send_welcome(context)
                results["send_welcome"] = result

            elif action_type == "capture_lead":
                result = await self._action_capture_lead(action_config, context, db)
                results["capture_lead"] = result

            elif action_type == "auto_reply":
                result = await self._action_auto_reply(action_config, context)
                results["auto_reply"] = result

            elif action_type == "notify_admin":
                result = await self._action_notify_admin(action_config, context)
                results["notify_admin"] = result

            elif action_type == "update_lead_status":
                result = await self._action_update_lead(action_config, context, db)
                results["update_lead_status"] = result

        return results

    async def _action_send_message(self, config: dict, context: dict) -> dict:
        """Send a predefined message."""
        phone = context.get("phone_number")
        message = config.get("message", "Thank you for reaching out!")

        if phone:
            return await whatsapp_service.send_text_message(phone, message)
        return {"status": "skipped", "reason": "no phone number"}

    async def _action_send_welcome(self, context: dict) -> dict:
        """Send a welcome message to new contacts."""
        phone = context.get("phone_number")
        name = context.get("contact_name", "there")

        welcome_msg = (
            f"👋 Hi {name}! Welcome to {settings.BUSINESS_NAME}!\n\n"
            f"I'm your AI assistant and I'm here to help you with:\n"
            f"📦 Order tracking\n"
            f"💰 Product information & pricing\n"
            f"❓ Answering your questions\n"
            f"👤 Connecting you with our team\n\n"
            f"How can I help you today?"
        )

        if phone:
            return await whatsapp_service.send_text_message(phone, welcome_msg)
        return {"status": "skipped", "reason": "no phone number"}

    async def _action_capture_lead(self, config: dict, context: dict, db: AsyncSession) -> dict:
        """Capture and update lead information."""
        contact_id = context.get("contact_id")
        if not contact_id:
            return {"status": "skipped", "reason": "no contact ID"}

        result = await db.execute(
            select(Contact).where(Contact.id == contact_id)
        )
        contact = result.scalar_one_or_none()

        if contact:
            contact.lead_score = min(contact.lead_score + config.get("score_increment", 10), 100)
            if config.get("tags"):
                existing_tags = contact.tags or []
                contact.tags = list(set(existing_tags + config["tags"]))
            await db.commit()
            return {"status": "captured", "lead_score": contact.lead_score}

        return {"status": "skipped", "reason": "contact not found"}

    async def _action_auto_reply(self, config: dict, context: dict) -> dict:
        """Send auto-reply when admin is offline."""
        phone = context.get("phone_number")
        message = config.get(
            "message",
            f"Thanks for your message! Our team at {settings.BUSINESS_NAME} is currently "
            f"unavailable. Our business hours are {settings.BUSINESS_HOURS}. "
            f"We'll get back to you as soon as possible! 🙏"
        )

        if phone:
            return await whatsapp_service.send_text_message(phone, message)
        return {"status": "skipped", "reason": "no phone number"}

    async def _action_notify_admin(self, config: dict, context: dict) -> dict:
        """Notify admin about important events (placeholder for webhook/notification)."""
        logger.info(f"Admin notification: {config.get('message', 'New event')} - Context: {context}")
        return {"status": "notified", "channel": config.get("channel", "log")}

    async def _action_update_lead(self, config: dict, context: dict, db: AsyncSession) -> dict:
        """Update lead status."""
        contact_id = context.get("contact_id")
        new_status = config.get("status", "contacted")

        if contact_id:
            result = await db.execute(
                select(Contact).where(Contact.id == contact_id)
            )
            contact = result.scalar_one_or_none()
            if contact:
                contact.lead_status = new_status
                await db.commit()
                return {"status": "updated", "new_lead_status": new_status}

        return {"status": "skipped"}


# Singleton
automation_engine = AutomationEngine()
