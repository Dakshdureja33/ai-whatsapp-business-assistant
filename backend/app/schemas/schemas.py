from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID
from app.models.models import (
    LeadStatus, MessageDirection, MessageType,
    ConversationStatus, OrderStatus, WorkflowTrigger
)


# ──────────────────────────────────────────────
# Contact / Lead Schemas
# ──────────────────────────────────────────────
class ContactBase(BaseModel):
    phone_number: str
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    tags: List[str] = []
    notes: Optional[str] = None


class ContactCreate(ContactBase):
    whatsapp_id: Optional[str] = None


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    lead_status: Optional[LeadStatus] = None
    lead_score: Optional[int] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None


class ContactResponse(ContactBase):
    id: UUID
    whatsapp_id: Optional[str]
    lead_status: LeadStatus
    lead_score: int
    first_message_at: datetime
    last_message_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Message Schemas
# ──────────────────────────────────────────────
class MessageBase(BaseModel):
    content: str
    message_type: MessageType = MessageType.TEXT


class MessageCreate(MessageBase):
    conversation_id: UUID
    direction: MessageDirection = MessageDirection.OUTBOUND
    is_ai_generated: bool = False


class MessageResponse(MessageBase):
    id: UUID
    conversation_id: UUID
    whatsapp_message_id: Optional[str]
    direction: MessageDirection
    is_ai_generated: bool
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Conversation Schemas
# ──────────────────────────────────────────────
class ConversationBase(BaseModel):
    subject: Optional[str] = None
    is_ai_enabled: bool = True


class ConversationCreate(ConversationBase):
    contact_id: UUID


class ConversationUpdate(BaseModel):
    status: Optional[ConversationStatus] = None
    subject: Optional[str] = None
    is_ai_enabled: Optional[bool] = None


class ConversationResponse(ConversationBase):
    id: UUID
    contact_id: UUID
    status: ConversationStatus
    message_count: int
    last_message_preview: Optional[str]
    started_at: datetime
    resolved_at: Optional[datetime]
    created_at: datetime
    contact: Optional[ContactResponse] = None

    class Config:
        from_attributes = True


class ConversationWithMessages(ConversationResponse):
    messages: List[MessageResponse] = []


# ──────────────────────────────────────────────
# FAQ Schemas
# ──────────────────────────────────────────────
class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    keywords: List[str] = []


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    keywords: Optional[List[str]] = None
    is_active: Optional[bool] = None


class FAQResponse(FAQBase):
    id: UUID
    is_active: bool
    usage_count: int
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Order Schemas
# ──────────────────────────────────────────────
class OrderItem(BaseModel):
    name: str
    quantity: int
    price: float


class OrderBase(BaseModel):
    items: List[OrderItem] = []
    total_amount: float = 0.0
    currency: str = "INR"
    shipping_address: Optional[str] = None


class OrderCreate(OrderBase):
    contact_id: UUID
    order_number: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: UUID
    order_number: str
    contact_id: UUID
    status: OrderStatus
    tracking_number: Optional[str]
    estimated_delivery: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Automation Workflow Schemas
# ──────────────────────────────────────────────
class WorkflowAction(BaseModel):
    type: str  # "send_message", "update_lead", "notify_admin"
    config: dict = {}


class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    trigger: WorkflowTrigger
    trigger_config: dict = {}
    actions: List[WorkflowAction] = []


class WorkflowCreate(WorkflowBase):
    pass


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger: Optional[WorkflowTrigger] = None
    trigger_config: Optional[dict] = None
    actions: Optional[List[WorkflowAction]] = None
    is_active: Optional[bool] = None


class WorkflowResponse(WorkflowBase):
    id: UUID
    is_active: bool
    execution_count: int
    last_executed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Analytics Schemas
# ──────────────────────────────────────────────
class AnalyticsOverview(BaseModel):
    total_contacts: int = 0
    new_leads_today: int = 0
    active_conversations: int = 0
    messages_today: int = 0
    conversion_rate: float = 0.0
    avg_response_time: float = 0.0
    ai_handled_percentage: float = 0.0
    total_orders: int = 0


class DailyMetric(BaseModel):
    date: str
    messages: int = 0
    new_leads: int = 0
    conversations: int = 0
    orders: int = 0


class LeadStatusBreakdown(BaseModel):
    status: str
    count: int


# ──────────────────────────────────────────────
# WhatsApp Webhook Schemas
# ──────────────────────────────────────────────
class WhatsAppWebhookPayload(BaseModel):
    object: str
    entry: List[dict] = []


class SendMessageRequest(BaseModel):
    phone_number: str
    message: str
    message_type: str = "text"


class AdminChatMessage(BaseModel):
    conversation_id: UUID
    content: str


# ──────────────────────────────────────────────
# Auth Schemas
# ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    company: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    company: Optional[str]
    role: str
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

