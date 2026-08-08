from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.feedback_report import FeedbackReportResponse
from app.db.dependencies import get_db
from app.services.feedback_service import FeedbackService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("", response_model=list[FeedbackReportResponse])
@router.get("/", response_model=list[FeedbackReportResponse])
def get_user_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FeedbackService(db)
    return service.get_user_reports(current_user.id)

@router.get("/session/{session_id}", response_model=FeedbackReportResponse)
def get_report_by_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FeedbackService(db)
    report = service.get_report_by_session(current_user.id, session_id)
    if not report:
        # if report hasn't been compiled yet, attempt to generate it on demand
        try:
            report = service.generate_report(current_user.id, session_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found and could not be generated."
            )
    return report

@router.get("/{report_id}", response_model=FeedbackReportResponse)
def get_report(
    report_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FeedbackService(db)
    report = service.get_report_by_id(current_user.id, report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return report
