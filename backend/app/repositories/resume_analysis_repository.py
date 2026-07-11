from sqlalchemy.orm import Session
from app.models.resume_analysis import ResumeAnalysis
from uuid import UUID

class ResumeAnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, analysis: ResumeAnalysis) -> ResumeAnalysis:
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis

    def get_by_resume(self, resume_id: UUID) -> list[ResumeAnalysis]:
        return (
            self.db.query(ResumeAnalysis)
            .filter(ResumeAnalysis.resume_id == resume_id)
            .order_by(ResumeAnalysis.created_at.desc())
            .all()
        )
