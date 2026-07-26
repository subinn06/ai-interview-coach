from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.schemas.resume_analysis import ResumeAnalysisResponse

class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    stored_filename: str
    file_path: str
    extracted_text: str | None = None
    created_at: datetime | None = None
    analyses: list[ResumeAnalysisResponse] = []

    class Config:
        from_attributes = True