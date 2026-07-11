from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.repositories.resume_repository import ResumeRepository
from app.services.file_service import FileService
from app.services.pdf_service import PDFService
from app.models.resume import Resume
from app.models.user import User

class ResumeService:
    def __init__(self, db: Session):
        self.repo = ResumeRepository(db)
        self.file_service = FileService()
        self.pdf_service = PDFService()

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
        return self.repo.create(resume)
