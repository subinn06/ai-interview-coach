from sqlalchemy.orm import Session
from fastapi import UploadFile
from uuid import UUID

from app.repositories.resume_repository import ResumeRepository
from app.repositories.resume_analysis_repository import ResumeAnalysisRepository
from app.services.file_service import FileService
from app.services.pdf_service import PDFService
from app.ai.resume_analyzer import ResumeAnalyzer
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.user import User

from app.services.analytics_service import AnalyticsService

class ResumeService:
    def __init__(self, db: Session):
        self.repo = ResumeRepository(db)
        self.analysis_repo = ResumeAnalysisRepository(db)
        self.file_service = FileService()
        self.pdf_service = PDFService()
        self.analyzer = ResumeAnalyzer()

    def upload(self, user: User, file: UploadFile) -> Resume:
        # validate and save the file to local disk
        stored_filename, file_path = self.file_service.save_resume(file)
        
        # parse text from the pdf file
        extracted_text = self.pdf_service.extract_text(file_path)
        
        # save the resume record in the database
        resume = Resume(
            user_id=user.id,
            filename=file.filename,
            stored_filename=stored_filename,
            file_path=file_path,
            extracted_text=extracted_text
        )
        created_resume = self.repo.create(resume)
        
        # track event
        AnalyticsService(self.repo.db).track_event(
            user.id, "RESUME_UPLOADED", {"filename": file.filename}
        )
        return created_resume

    def analyze(self, user_id: UUID, resume_id: UUID) -> ResumeAnalysis:
        # fetch resume and verify ownership
        resume = self.repo.get_by_id(resume_id)
        if not resume or resume.user_id != user_id:
            raise ValueError("Resume not found")

        # check if resume contains readable text
        if not resume.extracted_text or not resume.extracted_text.strip():
            raise ValueError("Resume contains no readable text.")

        # trigger gemini structured analysis
        analysis_result = self.analyzer.analyze(resume.extracted_text)

        # save and return analysis record
        analysis = ResumeAnalysis(
            resume_id=resume.id,
            ats_score=analysis_result.ats_score,
            strengths=analysis_result.strengths,
            weaknesses=analysis_result.weaknesses,
            missing_skills=analysis_result.missing_skills,
            summary=analysis_result.summary,
            raw_response=analysis_result.model_dump()
        )
        created_analysis = self.analysis_repo.create(analysis)
        
        # track event
        AnalyticsService(self.analysis_repo.db).track_event(
            user_id, "RESUME_ANALYZED", {"ats_score": analysis.ats_score}
        )
        return created_analysis
