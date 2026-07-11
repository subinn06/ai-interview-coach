from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ResumeAnalysisResponse(BaseModel):
    id: UUID
    resume_id: UUID
    ats_score: int
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True
