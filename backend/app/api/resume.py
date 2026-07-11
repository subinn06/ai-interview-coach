from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session

from app.schemas.resume import ResumeResponse
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
