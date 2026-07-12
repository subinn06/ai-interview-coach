from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class JobDescriptionCreate(BaseModel):
    job_title: str
    company_name: str
    description: str

class JobDescriptionResponse(BaseModel):
    id: UUID
    job_title: str
    company_name: str
    description: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobAnalysisResponse(BaseModel):
    id: UUID
    job_description_id: UUID
    required_skills: list[str]
    preferred_skills: list[str]
    experience_level: str
    responsibilities: list[str]
    keywords: list[str]
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True
