import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, DateTime, Boolean, Integer, Float,
    ForeignKey, Enum as SAEnum, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────
class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    LOST = "lost"


class MessageDirection(str, enum.Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"


class MessageType(str, enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    DOCUMENT = "document"
    TEMPLATE = "template"
    INTERACTIVE = "interactive"


class ConversationStatus(str, enum.Enum):
    ACTIVE = "active"
    AI_HANDLING = "ai_handling"
    HUMAN_HANDLING = "human_handling"
    RESOLVED = "resolved"
    ARCHIVED = "archived"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class WorkflowTrigger(str, enum.Enum):
    NEW_CONVERSATION = "new_conversation"
    KEYWORD = "keyword"
    SCHEDULED = "scheduled"
    ADMIN_OFFLINE = "admin_offline"
    ORDER_STATUS_CHANGE = "order_status_change"


# ──────────────────────────────────────────────
# Models
# ──────────────────────────────────────────────
class Contact(Base):
    """Customer contact record from WhatsApp."""
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    whatsapp_id = Column(String(50), unique=True, nullable=True)
    name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)
    company = Column(String(150), nullable=True)
    lead_status = Column(SAEnum(LeadStatus), default=LeadStatus.NEW)
    lead_score = Column(Integer, default=0)
    tags = Column(JSON, default=list)
    notes = Column(Text, nullable=True)
    first_message_at = Column(DateTime, default=datetime.utcnow)
    last_message_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    conversations = relationship("Conversation", back_populates="contact", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="contact", cascade="all, delete-orphan")


class Conversation(Base):
    """WhatsApp conversation thread."""
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=False)
    status = Column(SAEnum(ConversationStatus), default=ConversationStatus.AI_HANDLING)
    subject = Column(String(200), nullable=True)
    ai_context = Column(JSON, default=dict)
    is_ai_enabled = Column(Boolean, default=True)
    message_count = Column(Integer, default=0)
    last_message_preview = Column(String(200), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    """Individual WhatsApp message."""
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    whatsapp_message_id = Column(String(100), nullable=True, unique=True)
    direction = Column(SAEnum(MessageDirection), nullable=False)
    message_type = Column(SAEnum(MessageType), default=MessageType.TEXT)
    content = Column(Text, nullable=False)
    msg_metadata = Column(JSON, default=dict)
    is_ai_generated = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    delivered_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class FAQ(Base):
    """FAQ knowledge base for AI context."""
    __tablename__ = "faqs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    keywords = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Order(Base):
    """Mock order for order tracking simulation."""
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=False)
    status = Column(SAEnum(OrderStatus), default=OrderStatus.PENDING)
    items = Column(JSON, default=list)
    total_amount = Column(Float, default=0.0)
    currency = Column(String(3), default="INR")
    shipping_address = Column(Text, nullable=True)
    tracking_number = Column(String(50), nullable=True)
    estimated_delivery = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    contact = relationship("Contact", back_populates="orders")


class AutomationWorkflow(Base):
    """Automation workflow configuration."""
    __tablename__ = "automation_workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    trigger = Column(SAEnum(WorkflowTrigger), nullable=False)
    trigger_config = Column(JSON, default=dict)
    actions = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    execution_count = Column(Integer, default=0)
    last_executed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WebhookLog(Base):
    """Log of incoming Meta webhooks."""
    __tablename__ = "webhook_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(50), nullable=False)
    payload = Column(JSON, nullable=False)
    processed = Column(Boolean, default=False)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalyticsEvent(Base):
    """Analytics tracking events."""
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(50), nullable=False)
    event_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    """Admin user account for dashboard access."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    company = Column(String(150), nullable=True)
    role = Column(String(20), default="admin")
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

