import os
import uuid
from fastapi import UploadFile, HTTPException, status

# 10 mb max file size
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_MIME_TYPES = {"application/pdf"}

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

        # validate mime type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type: {file.content_type}. Only PDF files are accepted."
            )

        return file.filename

    def validate_file_size(self, file: UploadFile) -> None:
        # enforce max file size
        file.file.seek(0, 2)  # seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # reset to beginning
        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
            )

    def generate_filename(self, original_filename: str) -> str:
        # keep the original extension, generate a unique uuid prefix
        ext = os.path.splitext(original_filename)[1]
        return f"{uuid.uuid4()}{ext}"

    def save_resume(self, file: UploadFile) -> tuple[str, str]:
        # validate pdf extension and mime type
        original_filename = self.validate_pdf(file)

        # validate file size
        self.validate_file_size(file)
        
        # generate safe filename and write to disk
        stored_filename = self.generate_filename(original_filename)
        file_path = os.path.join(self.upload_dir, stored_filename)
        
        # read the file contents and write to disk
        with open(file_path, "wb") as f:
            f.write(file.file.read())
            
        return stored_filename, file_path

    def delete_resume(self, stored_filename: str) -> None:
        file_path = os.path.join(self.upload_dir, stored_filename)
        if os.path.exists(file_path):
            os.remove(file_path)
