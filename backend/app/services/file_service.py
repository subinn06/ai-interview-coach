import os
import uuid
from fastapi import UploadFile, HTTPException, status

class FileService:
    def __init__(self, upload_dir: str = "uploads/resumes"):
        self.upload_dir = upload_dir
        # ensure the uploads directory exists
        os.makedirs(self.upload_dir, exist_ok=True)

    def validate_pdf(self, file: UploadFile) -> str:
        # enforce that a filename is present and ends with .pdf
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed."
            )
        return file.filename

    def generate_filename(self, original_filename: str) -> str:
        # keep the original extension, generate a unique uuid prefix
        ext = os.path.splitext(original_filename)[1]
        return f"{uuid.uuid4()}{ext}"

    def save_resume(self, file: UploadFile) -> tuple[str, str]:
        # validate pdf extension
        original_filename = self.validate_pdf(file)
        
        # generate safe filename and write to disk
        stored_filename = self.generate_filename(original_filename)
        file_path = os.path.join(self.upload_dir, stored_filename)
        
        # read the file contents and write to disk
        with open(file_path, "wb") as f:
            f.write(file.file.read())
            
        return stored_filename, file_path
