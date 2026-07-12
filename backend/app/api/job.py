from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.job_description import JobDescriptionCreate, JobDescriptionResponse, JobAnalysisResponse
from app.db.dependencies import get_db
from app.services.job_service import JobService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobDescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    try:
        return job_service.save_job(current_user.id, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("", response_model=list[JobDescriptionResponse])
def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    return job_service.get_by_user(current_user.id)

@router.get("/{job_id}", response_model=JobDescriptionResponse)
def get_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    job = job_service.get_by_id(current_user.id, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    try:
        job_service.delete_job(current_user.id, job_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/{job_id}/analyze", response_model=JobAnalysisResponse)
def analyze_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    try:
        return job_service.analyze(current_user.id, job_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI analysis failed: {str(e)}"
        )
