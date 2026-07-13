from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.dashboard import (
    DashboardSummaryResponse,
    SkillBreakdownResponse,
    ProgressTimelineItem
)
from app.db.dependencies import get_db
from app.services.analytics_service import AnalyticsService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return service.get_summary(current_user.id)

@router.get("/skills", response_model=SkillBreakdownResponse)
def get_skill_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return service.get_skills_breakdown(current_user.id)

@router.get("/progress", response_model=list[ProgressTimelineItem])
def get_progress_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return service.get_progress_timeline(current_user.id)
