from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Any

class RecommendedTopic(BaseModel):
    topic: str
    reason: str
    priority: str

class FeedbackReportResponse(BaseModel):
    id: UUID
    session_id: UUID
    overall_score: int
    technical_score: int
    communication_score: int
    problem_solving_score: int
    confidence_score: int
    summary: str
    strengths: list[str]
    improvement_areas: list[str]
    recommended_topics: list[Any]
    created_at: datetime | None = None

    class Config:
        from_attributes = True
