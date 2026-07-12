from pydantic import BaseModel

class ResumeAnalysisSchema(BaseModel):
    ats_score: int
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    summary: str

class JobAnalysisSchema(BaseModel):
    required_skills: list[str]
    preferred_skills: list[str]
    experience_level: str
    responsibilities: list[str]
    keywords: list[str]
    summary: str
