"""
Analytics Dashboard API Routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta

from app.database import get_db
from app.models.models import (
    Contact, Conversation, Message, Order,
    LeadStatus, ConversationStatus, MessageDirection
)
from app.schemas.schemas import AnalyticsOverview, DailyMetric, LeadStatusBreakdown

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    """Get dashboard analytics overview."""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    # Total contacts
    total_contacts = await db.execute(select(func.count(Contact.id)))
    total = total_contacts.scalar() or 0

    # New leads today
    new_leads = await db.execute(
        select(func.count(Contact.id)).where(Contact.created_at >= today)
    )
    new_today = new_leads.scalar() or 0

    # Active conversations
    active_convs = await db.execute(
        select(func.count(Conversation.id)).where(
            Conversation.status.in_([
                ConversationStatus.ACTIVE,
                ConversationStatus.AI_HANDLING,
                ConversationStatus.HUMAN_HANDLING,
            ])
        )
    )
    active = active_convs.scalar() or 0

    # Messages today
    msgs_today = await db.execute(
        select(func.count(Message.id)).where(Message.created_at >= today)
    )
    msg_count = msgs_today.scalar() or 0

    # Conversion rate
    converted = await db.execute(
        select(func.count(Contact.id)).where(Contact.lead_status == LeadStatus.CONVERTED)
    )
    converted_count = converted.scalar() or 0
    conversion_rate = (converted_count / total * 100) if total > 0 else 0

    # AI handled percentage
    ai_msgs = await db.execute(
        select(func.count(Message.id)).where(
            Message.is_ai_generated == True,
            Message.direction == MessageDirection.OUTBOUND,
        )
    )
    total_outbound = await db.execute(
        select(func.count(Message.id)).where(
            Message.direction == MessageDirection.OUTBOUND
        )
    )
    ai_count = ai_msgs.scalar() or 0
    out_count = total_outbound.scalar() or 0
    ai_pct = (ai_count / out_count * 100) if out_count > 0 else 0

    # Total orders
    total_orders = await db.execute(select(func.count(Order.id)))
    order_count = total_orders.scalar() or 0

    return AnalyticsOverview(
        total_contacts=total,
        new_leads_today=new_today,
        active_conversations=active,
        messages_today=msg_count,
        conversion_rate=round(conversion_rate, 1),
        avg_response_time=2.3,
        ai_handled_percentage=round(ai_pct, 1),
        total_orders=order_count,
    )


@router.get("/daily", response_model=list[DailyMetric])
async def get_daily_metrics(days: int = 30, db: AsyncSession = Depends(get_db)):
    """Get daily metrics for the past N days."""
    metrics = []
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    for i in range(days - 1, -1, -1):
        day_start = today - timedelta(days=i)
        day_end = day_start + timedelta(days=1)

        msgs = await db.execute(
            select(func.count(Message.id)).where(
                and_(Message.created_at >= day_start, Message.created_at < day_end)
            )
        )
        leads = await db.execute(
            select(func.count(Contact.id)).where(
                and_(Contact.created_at >= day_start, Contact.created_at < day_end)
            )
        )
        convs = await db.execute(
            select(func.count(Conversation.id)).where(
                and_(Conversation.created_at >= day_start, Conversation.created_at < day_end)
            )
        )
        orders = await db.execute(
            select(func.count(Order.id)).where(
                and_(Order.created_at >= day_start, Order.created_at < day_end)
            )
        )

        metrics.append(DailyMetric(
            date=day_start.strftime("%Y-%m-%d"),
            messages=msgs.scalar() or 0,
            new_leads=leads.scalar() or 0,
            conversations=convs.scalar() or 0,
            orders=orders.scalar() or 0,
        ))

    return metrics


@router.get("/lead-breakdown", response_model=list[LeadStatusBreakdown])
async def get_lead_breakdown(db: AsyncSession = Depends(get_db)):
    """Get lead status breakdown."""
    result = await db.execute(
        select(Contact.lead_status, func.count(Contact.id))
        .group_by(Contact.lead_status)
    )
    rows = result.all()
    return [
        LeadStatusBreakdown(status=row[0].value, count=row[1])
        for row in rows
    ]
