"""
Order Management API Routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID
import random
import string

from app.database import get_db
from app.models.models import Order, OrderStatus
from app.schemas.schemas import OrderResponse, OrderCreate, OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    prefix = "ORD"
    suffix = ''.join(random.choices(string.digits, k=8))
    return f"{prefix}-{suffix}"


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    status: OrderStatus = None,
    contact_id: UUID = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    query = select(Order).order_by(desc(Order.created_at))
    if status:
        query = query.where(Order.status == status)
    if contact_id:
        query = query.where(Order.contact_id == contact_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.post("", response_model=OrderResponse)
async def create_order(data: OrderCreate, db: AsyncSession = Depends(get_db)):
    order_data = data.model_dump()
    order_data["order_number"] = data.order_number or generate_order_number()
    if order_data.get("items"):
        order_data["items"] = [
            item.model_dump() if hasattr(item, 'model_dump') else item
            for item in order_data["items"]
        ]
    order = Order(**order_data)
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return OrderResponse.model_validate(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: UUID, update: OrderUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    await db.commit()
    await db.refresh(order)
    return OrderResponse.model_validate(order)
