from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from datetime import datetime, timezone

from app.models.interview_session import InterviewSession
from app.models.feedback_report import FeedbackReport
from app.models.analytics_event import AnalyticsEvent

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def track_event(self, user_id: UUID, event_type: str, metadata: dict | None = None) -> None:
        event = AnalyticsEvent(
            user_id=user_id,
            event_type=event_type,
            metadata_json=metadata or {}
        )
        self.db.add(event)
        self.db.commit()

    def get_summary(self, user_id: UUID) -> dict:
        # fetch all completed sessions for this user
        completed_sessions = (
            self.db.query(InterviewSession)
            .filter(InterviewSession.user_id == user_id)
            .filter(InterviewSession.status == "completed")
            .all()
        )
        
        total_interviews = len(completed_sessions)
        if total_interviews == 0:
            return {
                "total_interviews": 0,
                "average_score": 0,
                "best_score": 0,
                "latest_score": 0
            }

        scores = [s.total_score for s in completed_sessions if s.total_score is not None]
        average_score = round(sum(scores) / len(scores)) if scores else 0
        best_score = max(scores) if scores else 0
        
        # latest completed session score
        sorted_sessions = sorted(completed_sessions, key=lambda s: s.completed_at or s.started_at, reverse=True)
        latest_score = sorted_sessions[0].total_score if sorted_sessions and sorted_sessions[0].total_score is not None else 0

        return {
            "total_interviews": total_interviews,
            "average_score": average_score,
            "best_score": best_score,
            "latest_score": latest_score
        }

    def get_skills_breakdown(self, user_id: UUID) -> dict:
        # query feedback reports joined with completed sessions of the user
        reports = (
            self.db.query(FeedbackReport)
            .join(InterviewSession)
            .filter(InterviewSession.user_id == user_id)
            .all()
        )

        if not reports:
            return {
                "technical": 0,
                "communication": 0,
                "problem_solving": 0,
                "confidence": 0
            }

        tech = [r.technical_score for r in reports]
        comm = [r.communication_score for r in reports]
        prob = [r.problem_solving_score for r in reports]
        conf = [r.confidence_score for r in reports]

        return {
            "technical": round(sum(tech) / len(tech)),
            "communication": round(sum(comm) / len(comm)),
            "problem_solving": round(sum(prob) / len(prob)),
            "confidence": round(sum(conf) / len(conf))
        }

    def get_progress_timeline(self, user_id: UUID) -> list[dict]:
        # chronological list of completed interview dates and scores
        sessions = (
            self.db.query(InterviewSession)
            .filter(InterviewSession.user_id == user_id)
            .filter(InterviewSession.status == "completed")
            .order_by(InterviewSession.completed_at.asc())
            .all()
        )

        timeline = []
        for s in sessions:
            if s.total_score is not None:
                # format date as yyyy-mm-dd
                dt = s.completed_at if s.completed_at else s.started_at
                date_str = dt.strftime("%Y-%m-%d")
                timeline.append({
                    "date": date_str,
                    "score": s.total_score
                })
        return timeline
