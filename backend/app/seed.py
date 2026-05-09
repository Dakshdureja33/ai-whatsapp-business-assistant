"""
Demo Data Seeder.

Seeds the database with realistic demo data for showcasing the platform.
"""

from datetime import datetime, timedelta
from sqlalchemy import select
from loguru import logger
import uuid
import random

from app.database import async_session
from app.models.models import (
    Contact, Conversation, Message, FAQ, Order, AutomationWorkflow,
    LeadStatus, ConversationStatus, MessageDirection, MessageType,
    OrderStatus, WorkflowTrigger
)


async def seed_demo_data():
    """Seed database with demo data if empty."""
    async with async_session() as db:
        existing = await db.execute(select(Contact).limit(1))
        if existing.scalar_one_or_none():
            logger.info("Demo data already exists, skipping seed.")
            return

        logger.info("Seeding demo data...")

        # ── Contacts ──
        contacts_data = [
            {"phone_number": "+919876543210", "name": "Rahul Sharma", "email": "rahul@example.com", "company": "TechCorp", "lead_status": LeadStatus.QUALIFIED, "lead_score": 75},
            {"phone_number": "+919876543211", "name": "Priya Patel", "email": "priya@example.com", "company": "DesignHub", "lead_status": LeadStatus.CONVERTED, "lead_score": 95},
            {"phone_number": "+919876543212", "name": "Amit Kumar", "email": "amit@example.com", "company": "StartupXYZ", "lead_status": LeadStatus.NEW, "lead_score": 20},
            {"phone_number": "+919876543213", "name": "Sneha Gupta", "email": "sneha@example.com", "company": "RetailMax", "lead_status": LeadStatus.CONTACTED, "lead_score": 45},
            {"phone_number": "+919876543214", "name": "Vikram Singh", "email": "vikram@example.com", "lead_status": LeadStatus.QUALIFIED, "lead_score": 60},
            {"phone_number": "+919876543215", "name": "Anita Desai", "email": "anita@example.com", "company": "MediaPro", "lead_status": LeadStatus.NEW, "lead_score": 10},
            {"phone_number": "+919876543216", "name": "Karan Mehta", "lead_status": LeadStatus.LOST, "lead_score": 5},
            {"phone_number": "+919876543217", "name": "Deepika Roy", "email": "deepika@example.com", "company": "EduTech", "lead_status": LeadStatus.CONVERTED, "lead_score": 90},
        ]

        contacts = []
        for i, cd in enumerate(contacts_data):
            c = Contact(
                **cd,
                first_message_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                last_message_at=datetime.utcnow() - timedelta(hours=random.randint(0, 48)),
            )
            db.add(c)
            contacts.append(c)

        await db.flush()

        # ── Demo Conversations & Messages ──
        chat_scripts = [
            [
                ("inbound", "Hi, I'm looking for a laptop for my office"),
                ("outbound", "Hello Rahul! 👋 Welcome to TechStore Pro! I'd be happy to help you find the perfect laptop. What's your budget range and primary use case?", True),
                ("inbound", "Around 60-70k, mainly for coding and development"),
                ("outbound", "Great choice! For coding and development in that range, I'd recommend:\n\n💻 **MacBook Air M2** - ₹69,900\n💻 **Dell XPS 13** - ₹64,500\n💻 **ThinkPad X1 Carbon** - ₹67,800\n\nAll come with 16GB RAM and 512GB SSD. Would you like details on any of these?", True),
                ("inbound", "Tell me more about the MacBook Air M2"),
                ("outbound", "The **MacBook Air M2** is excellent for developers! 🚀\n\n📱 15.3\" Liquid Retina Display\n⚡ Apple M2 chip (8-core CPU, 10-core GPU)\n🧠 16GB Unified Memory\n💾 512GB SSD\n🔋 18-hour battery life\n📦 Ships in 2-3 business days\n\nWould you like to place an order?", True),
            ],
            [
                ("inbound", "Where is my order?"),
                ("outbound", "Hi Priya! 📦 Let me check your order status.\n\nYour order **ORD-20240815** is currently **Shipped** and out for delivery!\n\n🚚 Tracking: TRACK123456\n📅 Estimated Delivery: Tomorrow by 6 PM\n\nIs there anything else I can help with?", True),
                ("inbound", "Thanks! Can I also get a phone case?"),
                ("outbound", "Of course! We have some great phone cases! 📱\n\nWhich phone model do you have? I'll show you our best options.", True),
            ],
            [
                ("inbound", "What are your store timings?"),
                ("outbound", "Our business hours are 🕐 9:00 AM - 6:00 PM (IST), Monday to Saturday.\n\nWe're also available on WhatsApp 24/7 with AI support! How can I help you today?", True),
                ("inbound", "Do you have any offers?"),
                ("outbound", "Yes! 🎉 We have some exciting offers right now:\n\n🔥 **Summer Sale** - Up to 30% off on laptops\n📱 **Combo Deal** - Phone + Case at 15% off\n💻 **Student Discount** - Extra 10% with valid ID\n\nWould you like to know more about any of these?", True),
            ],
        ]

        for i, (contact, script) in enumerate(zip(contacts[:3], chat_scripts)):
            conv = Conversation(
                contact_id=contact.id,
                status=ConversationStatus.AI_HANDLING if i != 1 else ConversationStatus.RESOLVED,
                message_count=len(script),
                last_message_preview=script[-1][1][:200],
                started_at=datetime.utcnow() - timedelta(days=random.randint(1, 7)),
            )
            db.add(conv)
            await db.flush()

            for j, (direction, content, *rest) in enumerate(script):
                is_ai = rest[0] if rest else False
                msg = Message(
                    conversation_id=conv.id,
                    direction=MessageDirection.INBOUND if direction == "inbound" else MessageDirection.OUTBOUND,
                    content=content,
                    is_ai_generated=is_ai,
                    created_at=datetime.utcnow() - timedelta(hours=len(script) - j),
                )
                db.add(msg)

        # ── FAQs ──
        faqs_data = [
            {"question": "What are your business hours?", "answer": "We are open Monday to Saturday, 9:00 AM to 6:00 PM IST.", "category": "General", "keywords": ["hours", "timing", "open", "close"]},
            {"question": "Do you offer free shipping?", "answer": "Yes! We offer free shipping on all orders above ₹2,000.", "category": "Shipping", "keywords": ["shipping", "delivery", "free"]},
            {"question": "What is your return policy?", "answer": "We offer 30-day hassle-free returns on all products.", "category": "Returns", "keywords": ["return", "refund", "exchange"]},
            {"question": "Do you accept EMI payments?", "answer": "Yes, we offer EMI options on orders above ₹5,000 through all major banks.", "category": "Payment", "keywords": ["emi", "payment", "installment"]},
            {"question": "How long does delivery take?", "answer": "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 days.", "category": "Shipping", "keywords": ["delivery", "time", "how long", "days"]},
            {"question": "Do you offer warranty?", "answer": "All products come with manufacturer warranty. Extended warranty plans are also available.", "category": "Warranty", "keywords": ["warranty", "guarantee", "protection"]},
        ]

        for fd in faqs_data:
            db.add(FAQ(**fd, usage_count=random.randint(0, 50)))

        # ── Orders ──
        orders_data = [
            {"contact": contacts[0], "order_number": "ORD-20240815", "status": OrderStatus.SHIPPED, "items": [{"name": "MacBook Air M2", "quantity": 1, "price": 69900}], "total_amount": 69900, "tracking_number": "TRACK123456"},
            {"contact": contacts[1], "order_number": "ORD-20240820", "status": OrderStatus.DELIVERED, "items": [{"name": "iPhone 15 Pro", "quantity": 1, "price": 134900}], "total_amount": 134900, "tracking_number": "TRACK789012"},
            {"contact": contacts[2], "order_number": "ORD-20240901", "status": OrderStatus.PROCESSING, "items": [{"name": "AirPods Pro", "quantity": 2, "price": 24900}], "total_amount": 49800},
            {"contact": contacts[3], "order_number": "ORD-20240905", "status": OrderStatus.PENDING, "items": [{"name": "iPad Air", "quantity": 1, "price": 59900}], "total_amount": 59900},
        ]

        for od in orders_data:
            db.add(Order(
                contact_id=od["contact"].id,
                order_number=od["order_number"],
                status=od["status"],
                items=od["items"],
                total_amount=od["total_amount"],
                tracking_number=od.get("tracking_number"),
                estimated_delivery=datetime.utcnow() + timedelta(days=random.randint(1, 7)),
            ))

        # ── Automation Workflows ──
        workflows_data = [
            {
                "name": "Welcome Message",
                "description": "Send a welcome message to new contacts",
                "trigger": WorkflowTrigger.NEW_CONVERSATION,
                "actions": [{"type": "send_welcome", "config": {}}],
                "is_active": True,
                "execution_count": 45,
            },
            {
                "name": "Lead Capture",
                "description": "Automatically score and tag new leads",
                "trigger": WorkflowTrigger.NEW_CONVERSATION,
                "actions": [{"type": "capture_lead", "config": {"score_increment": 15, "tags": ["new_lead", "whatsapp"]}}],
                "is_active": True,
                "execution_count": 38,
            },
            {
                "name": "After-Hours Auto Reply",
                "description": "Respond when admin is offline",
                "trigger": WorkflowTrigger.ADMIN_OFFLINE,
                "actions": [{"type": "auto_reply", "config": {"message": "Thanks for reaching out! Our team is offline. We'll respond within 24 hours. 🙏"}}],
                "is_active": True,
                "execution_count": 22,
            },
            {
                "name": "Order Status Notification",
                "description": "Notify customers of order updates",
                "trigger": WorkflowTrigger.ORDER_STATUS_CHANGE,
                "actions": [{"type": "send_message", "config": {"message": "Your order status has been updated! Check the details in our store."}}],
                "is_active": False,
                "execution_count": 15,
            },
        ]

        for wd in workflows_data:
            db.add(AutomationWorkflow(**wd))

        await db.commit()
        logger.info("Demo data seeded successfully! 🎉")
