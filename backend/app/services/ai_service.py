"""
AI Service - Groq/Llama 3.3 Integration.

Handles AI-powered response generation with:
- Context-aware conversations
- FAQ knowledge base retrieval
- Order status lookups
- Structured prompt engineering
"""

from groq import AsyncGroq
from loguru import logger
from typing import Optional, List
from app.config import get_settings

settings = get_settings()


class AIService:
    """AI service powered by Groq (Llama 3.3)."""

    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        self.model = settings.GROQ_MODEL
        self.max_tokens = settings.AI_MAX_TOKENS
        self.temperature = settings.AI_TEMPERATURE

    def _build_system_prompt(self, faqs: list = None, order_info: dict = None) -> str:
        """Build the system prompt with business context."""
        prompt = f"""You are an AI customer support assistant for {settings.BUSINESS_NAME}, a premium technology store.

Your role is to:
1. Answer customer questions about products, services, pricing, and store information
2. Help with order tracking and status updates
3. Capture lead information when customers show interest
4. Provide a friendly, professional, and helpful experience
5. Escalate to a human agent when needed

Business Information:
- Business: {settings.BUSINESS_NAME}
- Hours: {settings.BUSINESS_HOURS}
- Timezone: {settings.BUSINESS_TIMEZONE}

Communication Guidelines:
- Be concise but helpful (max 2-3 short paragraphs)
- Use a friendly, professional tone
- Include relevant emojis sparingly (1-2 per message)
- If you don't know something, say so honestly
- For complex issues, offer to connect with a human agent
- Always try to be helpful and provide value
"""

        if faqs:
            prompt += "\n\nFrequently Asked Questions (use these to answer common queries):\n"
            for faq in faqs:
                prompt += f"\nQ: {faq['question']}\nA: {faq['answer']}\n"

        if order_info:
            prompt += f"\n\nCurrent Order Information:\n"
            prompt += f"- Order Number: {order_info.get('order_number', 'N/A')}\n"
            prompt += f"- Status: {order_info.get('status', 'N/A')}\n"
            prompt += f"- Items: {order_info.get('items', 'N/A')}\n"
            prompt += f"- Tracking: {order_info.get('tracking_number', 'Not available yet')}\n"
            prompt += f"- Estimated Delivery: {order_info.get('estimated_delivery', 'TBD')}\n"

        return prompt

    async def generate_response(
        self,
        user_message: str,
        conversation_history: list = None,
        faqs: list = None,
        order_info: dict = None,
    ) -> str:
        """
        Generate an AI response using Groq/Llama 3.3.

        Args:
            user_message: The customer's message
            conversation_history: Previous messages for context
            faqs: Relevant FAQs for knowledge base
            order_info: Order details if order inquiry detected

        Returns:
            AI-generated response string
        """
        if not self.client:
            logger.warning("Groq API key not configured. Using fallback response.")
            return self._fallback_response(user_message)

        try:
            system_prompt = self._build_system_prompt(faqs, order_info)

            messages = [{"role": "system", "content": system_prompt}]

            # Add conversation history for context
            if conversation_history:
                for msg in conversation_history[-10:]:  # Last 10 messages for context
                    role = "user" if msg.get("direction") == "inbound" else "assistant"
                    messages.append({"role": role, "content": msg["content"]})

            messages.append({"role": "user", "content": user_message})

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
            )

            ai_response = response.choices[0].message.content
            logger.info(f"AI response generated: {ai_response[:100]}...")
            return ai_response

        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            return self._fallback_response(user_message)

    def _fallback_response(self, user_message: str) -> str:
        """Provide a fallback response when AI is unavailable."""
        lower_msg = user_message.lower()

        if any(word in lower_msg for word in ["hi", "hello", "hey"]):
            return f"👋 Hello! Welcome to {settings.BUSINESS_NAME}! How can I help you today?"

        if any(word in lower_msg for word in ["order", "track", "delivery", "shipping"]):
            return "📦 I'd be happy to help you track your order! Could you please share your order number?"

        if any(word in lower_msg for word in ["price", "cost", "how much"]):
            return "💰 I'd love to help with pricing information! Could you tell me which product you're interested in?"

        if any(word in lower_msg for word in ["hours", "open", "timing", "close"]):
            return f"🕐 Our business hours are {settings.BUSINESS_HOURS} ({settings.BUSINESS_TIMEZONE}). Is there anything else I can help with?"

        if any(word in lower_msg for word in ["human", "agent", "person", "support"]):
            return "👤 I'll connect you with a human agent right away. Please hold on for a moment!"

        return (
            f"Thank you for reaching out to {settings.BUSINESS_NAME}! "
            "I'm here to help. Could you tell me more about what you're looking for? "
            "I can assist with product info, order tracking, pricing, and more! 😊"
        )

    def detect_intent(self, message: str) -> str:
        """Detect the intent of a customer message."""
        lower_msg = message.lower()

        if any(word in lower_msg for word in ["order", "track", "where is my", "delivery", "shipping"]):
            return "order_tracking"
        if any(word in lower_msg for word in ["price", "cost", "how much", "pricing"]):
            return "pricing"
        if any(word in lower_msg for word in ["hours", "open", "timing", "close", "when"]):
            return "business_hours"
        if any(word in lower_msg for word in ["human", "agent", "person", "speak to", "talk to"]):
            return "human_handoff"
        if any(word in lower_msg for word in ["hi", "hello", "hey", "good morning", "good evening"]):
            return "greeting"
        if any(word in lower_msg for word in ["bye", "thank", "thanks", "goodbye"]):
            return "farewell"
        if any(word in lower_msg for word in ["help", "support", "issue", "problem", "complaint"]):
            return "support"
        if any(word in lower_msg for word in ["buy", "purchase", "interested", "want to"]):
            return "purchase_intent"

        return "general"


# Singleton instance
ai_service = AIService()
