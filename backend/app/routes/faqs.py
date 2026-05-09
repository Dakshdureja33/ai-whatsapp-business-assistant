"""
FAQ Knowledge Base API Routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID

from app.database import get_db
from app.models.models import FAQ
from app.schemas.schemas import FAQResponse, FAQCreate, FAQUpdate

router = APIRouter(prefix="/faqs", tags=["FAQ Knowledge Base"])


@router.get("", response_model=list[FAQResponse])
async def list_faqs(
    category: str = None,
    active_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """List all FAQs with optional category filter."""
    query = select(FAQ).order_by(desc(FAQ.usage_count))

    if category:
        query = query.where(FAQ.category == category)

    if active_only:
        query = query.where(FAQ.is_active == True)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    faqs = result.scalars().all()

    return [FAQResponse.model_validate(f) for f in faqs]


@router.get("/{faq_id}", response_model=FAQResponse)
async def get_faq(faq_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single FAQ."""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()

    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    return FAQResponse.model_validate(faq)


@router.post("", response_model=FAQResponse)
async def create_faq(data: FAQCreate, db: AsyncSession = Depends(get_db)):
    """Create a new FAQ entry."""
    faq = FAQ(**data.model_dump())
    db.add(faq)
    await db.commit()
    await db.refresh(faq)

    return FAQResponse.model_validate(faq)


@router.patch("/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: UUID, update: FAQUpdate, db: AsyncSession = Depends(get_db)
):
    """Update an FAQ entry."""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()

    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)

    await db.commit()
    await db.refresh(faq)

    return FAQResponse.model_validate(faq)


@router.delete("/{faq_id}")
async def delete_faq(faq_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete an FAQ entry."""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()

    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    await db.delete(faq)
    await db.commit()

    return {"status": "deleted", "id": str(faq_id)}
