import io
import os
import uuid

import boto3
from fastapi import UploadFile, HTTPException, status


MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_MIME_TYPES = {"application/pdf"}


class FileService:
    def __init__(
        self,
        bucket_name: str = "ai-interview-coach-resumes-044235043327",
    ):
        self.bucket_name = bucket_name
        self.s3 = boto3.client("s3")

    def validate_pdf(self, file: UploadFile) -> str:
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed.",
            )

        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type: {file.content_type}. Only PDF files are accepted.",
            )

        return file.filename

    def validate_file_size(self, file: UploadFile) -> None:
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
            )

    def generate_filename(self, original_filename: str) -> str:
        ext = os.path.splitext(original_filename)[1]
        return f"{uuid.uuid4()}{ext}"

    def save_resume(self, file: UploadFile, user_id: str) -> tuple[str, str, bytes]:
        original_filename = self.validate_pdf(file)
        self.validate_file_size(file)

        stored_filename = self.generate_filename(original_filename)
        file_bytes = file.file.read()

        s3_key = f"users/{user_id}/resumes/{stored_filename}"

        self.s3.upload_fileobj(
            io.BytesIO(file_bytes),
            self.bucket_name,
            s3_key,
            ExtraArgs={"ContentType": "application/pdf"},
        )

        return stored_filename, s3_key, file_bytes

    def delete_resume(self, s3_key: str) -> None:
        self.s3.delete_object(
            Bucket=self.bucket_name,
            Key=s3_key,
        )