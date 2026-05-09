"""
Automation Workflow API Routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID

from app.database import get_db
from app.models.models import AutomationWorkflow
from app.schemas.schemas import WorkflowResponse, WorkflowCreate, WorkflowUpdate

router = APIRouter(prefix="/workflows", tags=["Automation Workflows"])


@router.get("", response_model=list[WorkflowResponse])
async def list_workflows(
    active_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    query = select(AutomationWorkflow).order_by(desc(AutomationWorkflow.created_at))
    if active_only:
        query = query.where(AutomationWorkflow.is_active == True)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    workflows = result.scalars().all()
    return [WorkflowResponse.model_validate(w) for w in workflows]


@router.post("", response_model=WorkflowResponse)
async def create_workflow(data: WorkflowCreate, db: AsyncSession = Depends(get_db)):
    workflow_data = data.model_dump()
    if workflow_data.get("actions"):
        workflow_data["actions"] = [
            a.model_dump() if hasattr(a, 'model_dump') else a
            for a in workflow_data["actions"]
        ]
    workflow = AutomationWorkflow(**workflow_data)
    db.add(workflow)
    await db.commit()
    await db.refresh(workflow)
    return WorkflowResponse.model_validate(workflow)


@router.patch("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: UUID, update: WorkflowUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AutomationWorkflow).where(AutomationWorkflow.id == workflow_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "actions" and value:
            value = [a.model_dump() if hasattr(a, 'model_dump') else a for a in value]
        setattr(workflow, field, value)
    await db.commit()
    await db.refresh(workflow)
    return WorkflowResponse.model_validate(workflow)


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AutomationWorkflow).where(AutomationWorkflow.id == workflow_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    await db.delete(workflow)
    await db.commit()
    return {"status": "deleted", "id": str(workflow_id)}
