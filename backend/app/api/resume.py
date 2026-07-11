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

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    resume = resume_service.upload(current_user, file)
    return resume

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
        # user error cases (ownership mismatch, empty text)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # upstream ai issues (credentials, model failures)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI analysis failed: {str(e)}"
        )
