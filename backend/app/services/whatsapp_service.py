"""
WhatsApp Cloud API Integration Service.

Handles all communication with Meta's WhatsApp Business Cloud API including:
- Sending text messages
- Sending template messages
- Sending interactive messages
- Processing incoming webhooks
- Message status tracking
"""

import httpx
from loguru import logger
from app.config import get_settings

settings = get_settings()


class WhatsAppService:
    """Service for interacting with the WhatsApp Cloud API."""

    def __init__(self):
        self.api_url = f"{settings.WHATSAPP_API_URL}/{settings.WHATSAPP_API_VERSION}"
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.access_token = settings.WHATSAPP_ACCESS_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }

    async def send_text_message(self, to: str, message: str) -> dict:
        """
        Send a text message via WhatsApp Cloud API.

        Args:
            to: Recipient phone number (with country code)
            message: Text message content

        Returns:
            API response dict
        """
        url = f"{self.api_url}/{self.phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "text",
            "text": {"preview_url": False, "body": message},
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, json=payload, headers=self.headers, timeout=30.0
                )
                response.raise_for_status()
                result = response.json()
                logger.info(f"Message sent to {to}: {result}")
                return result
        except httpx.HTTPStatusError as e:
            logger.error(f"WhatsApp API error: {e.response.text}")
            return {"error": str(e), "status_code": e.response.status_code}
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
            return {"error": str(e)}

    async def send_template_message(
        self, to: str, template_name: str, language: str = "en_US", components: list = None
    ) -> dict:
        """
        Send a template message via WhatsApp Cloud API.

        Args:
            to: Recipient phone number
            template_name: Approved template name
            language: Template language code
            components: Template components (header, body, buttons)

        Returns:
            API response dict
        """
        url = f"{self.api_url}/{self.phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language},
            },
        }

        if components:
            payload["template"]["components"] = components

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, json=payload, headers=self.headers, timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Failed to send template message: {e}")
            return {"error": str(e)}

    async def send_interactive_message(
        self, to: str, body_text: str, buttons: list
    ) -> dict:
        """
        Send an interactive button message.

        Args:
            to: Recipient phone number
            body_text: Message body
            buttons: List of button dicts with 'id' and 'title'

        Returns:
            API response dict
        """
        url = f"{self.api_url}/{self.phone_number_id}/messages"
        button_list = [
            {"type": "reply", "reply": {"id": btn["id"], "title": btn["title"]}}
            for btn in buttons[:3]  # WhatsApp allows max 3 buttons
        ]

        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {"text": body_text},
                "action": {"buttons": button_list},
            },
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, json=payload, headers=self.headers, timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Failed to send interactive message: {e}")
            return {"error": str(e)}

    async def mark_as_read(self, message_id: str) -> dict:
        """Mark a message as read."""
        url = f"{self.api_url}/{self.phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "status": "read",
            "message_id": message_id,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, json=payload, headers=self.headers, timeout=30.0
                )
                return response.json()
        except Exception as e:
            logger.error(f"Failed to mark message as read: {e}")
            return {"error": str(e)}

    def parse_webhook_message(self, payload: dict) -> list:
        """
        Parse incoming webhook payload from Meta.

        Args:
            payload: Raw webhook payload

        Returns:
            List of parsed message dicts
        """
        messages = []

        try:
            for entry in payload.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})

                    # Extract contact info
                    contacts = value.get("contacts", [])
                    contact_info = contacts[0] if contacts else {}

                    # Extract messages
                    for msg in value.get("messages", []):
                        parsed = {
                            "message_id": msg.get("id"),
                            "from": msg.get("from"),
                            "timestamp": msg.get("timestamp"),
                            "type": msg.get("type", "text"),
                            "contact_name": contact_info.get("profile", {}).get("name", "Unknown"),
                        }

                        if msg.get("type") == "text":
                            parsed["content"] = msg.get("text", {}).get("body", "")
                        elif msg.get("type") == "interactive":
                            interactive = msg.get("interactive", {})
                            if interactive.get("type") == "button_reply":
                                parsed["content"] = interactive.get("button_reply", {}).get("title", "")
                                parsed["button_id"] = interactive.get("button_reply", {}).get("id", "")
                            elif interactive.get("type") == "list_reply":
                                parsed["content"] = interactive.get("list_reply", {}).get("title", "")
                        else:
                            parsed["content"] = f"[{msg.get('type', 'unknown')} message]"

                        messages.append(parsed)

                    # Process status updates
                    for status in value.get("statuses", []):
                        messages.append({
                            "type": "status_update",
                            "message_id": status.get("id"),
                            "status": status.get("status"),
                            "timestamp": status.get("timestamp"),
                            "recipient_id": status.get("recipient_id"),
                        })

        except Exception as e:
            logger.error(f"Error parsing webhook: {e}")

        return messages


# Singleton instance
whatsapp_service = WhatsAppService()
