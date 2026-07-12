from sqlalchemy.orm import Session
from uuid import UUID

from app.repositories.job_repository import JobRepository
from app.ai.job_analyzer import JobAnalyzer
from app.models.job_description import JobDescription
from app.models.job_analysis import JobAnalysis
from app.schemas.job_description import JobDescriptionCreate

class JobService:
    def __init__(self, db: Session):
        self.repo = JobRepository(db)
        self.analyzer = JobAnalyzer()

    def save_job(self, user_id: UUID, payload: JobDescriptionCreate) -> JobDescription:
        # enforce empty content validation check
        if not payload.description.strip():
            raise ValueError("Job description cannot be empty.")
            
        job_desc = JobDescription(
            user_id=user_id,
            job_title=payload.job_title,
            company_name=payload.company_name,
            description=payload.description
        )
        return self.repo.create(job_desc)

    def get_by_user(self, user_id: UUID) -> list[JobDescription]:
        return self.repo.get_by_user(user_id)

    def get_by_id(self, user_id: UUID, job_id: UUID) -> JobDescription | None:
        job = self.repo.get_by_id(job_id)
        if not job or job.user_id != user_id:
            # standard 404 security strategy
            return None
        return job

    def delete_job(self, user_id: UUID, job_id: UUID) -> None:
        job = self.repo.get_by_id(job_id)
        if not job or job.user_id != user_id:
            raise ValueError("Job description not found")
        self.repo.delete(job)

    def analyze(self, user_id: UUID, job_id: UUID) -> JobAnalysis:
        job = self.repo.get_by_id(job_id)
        if not job or job.user_id != user_id:
            raise ValueError("Job description not found")

        # double check description content
        if not job.description or not job.description.strip():
            raise ValueError("Job description cannot be empty.")

        # query llm structured job analyzer
        analysis_result = self.analyzer.analyze(
            job_title=job.job_title,
            company_name=job.company_name,
            description=job.description
        )

        # clear existing analysis
        old_analysis = self.repo.get_analysis_by_job(job.id)
        if old_analysis:
            self.repo.db.delete(old_analysis)
            self.repo.db.commit()

        # save and return new analysis record
        analysis = JobAnalysis(
            job_description_id=job.id,
            required_skills=analysis_result.required_skills,
            preferred_skills=analysis_result.preferred_skills,
            experience_level=analysis_result.experience_level,
            responsibilities=analysis_result.responsibilities,
            keywords=analysis_result.keywords,
            summary=analysis_result.summary,
            raw_response=analysis_result.model_dump()
        )
        return self.repo.create_analysis(analysis)
