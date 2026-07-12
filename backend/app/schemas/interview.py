from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class InterviewStartRequest(BaseModel):
    resume_id: UUID
    job_description_id: UUID
    difficulty: str

class InterviewQuestionResponse(BaseModel):
    id: UUID
    question: str
    category: str
    order_number: int

    class Config:
        from_attributes = True

class InterviewStartResponse(BaseModel):
    session_id: UUID
    first_question: InterviewQuestionResponse

class AnswerSubmitRequest(BaseModel):
    question_id: UUID
    answer: str

class AnswerEvaluationResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    weaknesses: list[str]
    improvements: list[str]

class AnswerSubmitResponse(BaseModel):
    evaluation: AnswerEvaluationResponse
    next_question: Optional[InterviewQuestionResponse] = None

class InterviewSessionResponse(BaseModel):
    id: UUID
    status: str
    difficulty: str
    total_score: Optional[int] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# detailed q&a response schemas
class InterviewAnswerResponse(BaseModel):
    id: UUID
    answer: str
    score: int
    feedback: str
    answered_at: datetime

    class Config:
        from_attributes = True

class InterviewQuestionDetailResponse(BaseModel):
    id: UUID
    question: str
    category: str
    order_number: int
    expected_topics: list[str]
    created_at: datetime
    answer: Optional[InterviewAnswerResponse] = None

    class Config:
        from_attributes = True

class InterviewSessionDetailResponse(BaseModel):
    id: UUID
    status: str
    difficulty: str
    total_score: Optional[int] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    questions: list[InterviewQuestionDetailResponse]

    class Config:
        from_attributes = True
