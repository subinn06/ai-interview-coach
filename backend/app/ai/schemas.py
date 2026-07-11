from pydantic import BaseModel

class ResumeAnalysisSchema(BaseModel):
    ats_score: int
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    summary: str
