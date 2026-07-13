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

class RecommendedTopicSchema(BaseModel):
    topic: str
    reason: str
    priority: str

class FeedbackSchema(BaseModel):
    overall_score: int
    technical_score: int
    communication_score: int
    problem_solving_score: int
    confidence_score: int
    strengths: list[str]
    improvement_areas: list[str]
    recommended_topics: list[RecommendedTopicSchema]
    summary: str
