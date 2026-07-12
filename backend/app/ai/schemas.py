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

class GeneratedQuestionSchema(BaseModel):
    question: str
    category: str
    expected_topics: list[str]

class GeneratedQuestionListSchema(BaseModel):
    questions: list[GeneratedQuestionSchema]

class AnswerEvaluationSchema(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    weaknesses: list[str]
    improvements: list[str]

class FeedbackReportSchema(BaseModel):
    overall_score: int
    technical: int
    communication: int
    confidence: int
    summary: str
