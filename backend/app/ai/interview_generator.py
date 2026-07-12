import json
import logging
from app.ai.client import GeminiClient
from app.ai.prompts import PromptBuilder
from app.ai.schemas import GeneratedQuestionListSchema, GeneratedQuestionSchema

logger = logging.getLogger("app.ai")

class QuestionGenerationError(Exception):
    """Raised when the AI model fails to generate a valid structured interview question list."""
    pass

class InterviewGenerator:
    def __init__(self):
        self.client = GeminiClient()

    def generate_questions(
        self,
        resume_analysis: dict,
        job_analysis: dict,
        difficulty: str,
        count: int = 5
    ) -> list[GeneratedQuestionSchema]:
        # build prompt
        prompt = PromptBuilder.interview_questions(resume_analysis, job_analysis, difficulty, count)
        
        # query gemini structured output endpoint
        try:
            raw_response = self.client.generate_structured(prompt, GeneratedQuestionListSchema)
        except Exception as e:
            logger.error(f"Gemini client content generation failed for interview questions: {str(e)}")
            raise QuestionGenerationError(f"Gemini model query failed: {str(e)}")
            
        # parse and validate response
        try:
            parsed_data = json.loads(raw_response)
            validated = GeneratedQuestionListSchema(**parsed_data)
            return validated.questions
        except Exception as e:
            logger.error(
                f"Validation against GeneratedQuestionListSchema failed. "
                f"Raw Response: '{raw_response}'. Error: {str(e)}"
            )
            raise QuestionGenerationError(f"Structured AI output parsing failed: {str(e)}")
