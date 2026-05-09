"""
Contact / Lead Management API Routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID

from app.database import get_db
from app.models.models import Contact, LeadStatus
from app.schemas.schemas import ContactResponse, ContactCreate, ContactUpdate

router = APIRouter(prefix="/contacts", tags=["Contacts / Leads"])


@router.get("", response_model=list[ContactResponse])
async def list_contacts(
    status: LeadStatus = None,
    search: str = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all contacts/leads with optional filters."""
    query = select(Contact).order_by(desc(Contact.last_message_at))

    if status:
        query = query.where(Contact.lead_status == status)

    if search:
        query = query.where(
            Contact.name.ilike(f"%{search}%")
            | Contact.phone_number.ilike(f"%{search}%")
            | Contact.email.ilike(f"%{search}%")
        )

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    contacts = result.scalars().all()

    return [ContactResponse.model_validate(c) for c in contacts]


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single contact by ID."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return ContactResponse.model_validate(contact)


@router.post("", response_model=ContactResponse)
async def create_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    """Create a new contact/lead."""
    existing = await db.execute(
        select(Contact).where(Contact.phone_number == data.phone_number)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Contact already exists")

    contact = Contact(**data.model_dump())
    db.add(contact)
    await db.commit()
    await db.refresh(contact)

    return ContactResponse.model_validate(contact)


@router.patch("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: UUID, update: ContactUpdate, db: AsyncSession = Depends(get_db)
):
    """Update contact/lead details."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)

    await db.commit()
    await db.refresh(contact)

    return ContactResponse.model_validate(contact)


@router.delete("/{contact_id}")
async def delete_contact(contact_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a contact."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    await db.delete(contact)
    await db.commit()

    return {"status": "deleted", "id": str(contact_id)}
