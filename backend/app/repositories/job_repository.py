from sqlalchemy.orm import Session
from app.models.job_description import JobDescription
from app.models.job_analysis import JobAnalysis
from uuid import UUID

class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    # job description crud operations
    def create(self, job_desc: JobDescription) -> JobDescription:
        self.db.add(job_desc)
        self.db.commit()
        self.db.refresh(job_desc)
        return job_desc

    def get_by_id(self, job_id: UUID) -> JobDescription | None:
        val_id = UUID(job_id) if isinstance(job_id, str) else job_id
        return self.db.query(JobDescription).filter(JobDescription.id == val_id).first()

    def get_by_user(self, user_id: UUID) -> list[JobDescription]:
        val_id = UUID(user_id) if isinstance(user_id, str) else user_id
        return (
            self.db.query(JobDescription)
            .filter(JobDescription.user_id == val_id)
            .order_by(JobDescription.created_at.desc())
            .all()
        )

    def delete(self, job_desc: JobDescription) -> None:
        self.db.delete(job_desc)
        self.db.commit()

    # job analysis operations
    def create_analysis(self, analysis: JobAnalysis) -> JobAnalysis:
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis

    def get_analysis_by_job(self, job_description_id: UUID) -> JobAnalysis | None:
        val_id = UUID(job_description_id) if isinstance(job_description_id, str) else job_description_id
        return (
            self.db.query(JobAnalysis)
            .filter(JobAnalysis.job_description_id == val_id)
            .first()
        )
