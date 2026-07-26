from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.resume import ResumeResponse
from app.schemas.resume_analysis import ResumeAnalysisResponse
from app.db.dependencies import get_db
from app.services.resume_service import ResumeService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)

@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    resume = resume_service.upload(current_user, file)
    return resume

@router.get("", response_model=list[ResumeResponse])
@router.get("/", response_model=list[ResumeResponse])
def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    return resume_service.get_user_resumes(current_user.id)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    try:
        return resume_service.get_resume(current_user.id, resume_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    try:
        analysis = resume_service.analyze(current_user.id, resume_id)
        return analysis
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

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    try:
        resume_service.delete_resume(current_user.id, resume_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
