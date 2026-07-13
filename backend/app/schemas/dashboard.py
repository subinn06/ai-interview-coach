from pydantic import BaseModel

class DashboardSummaryResponse(BaseModel):
    total_interviews: int
    average_score: int
    best_score: int
    latest_score: int

class SkillBreakdownResponse(BaseModel):
    technical: int
    communication: int
    problem_solving: int
    confidence: int

class ProgressTimelineItem(BaseModel):
    date: str
    score: int
