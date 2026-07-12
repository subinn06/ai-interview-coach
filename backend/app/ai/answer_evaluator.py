import json
import logging
from app.ai.client import GeminiClient
from app.ai.prompts import PromptBuilder
from app.ai.schemas import AnswerEvaluationSchema

logger = logging.getLogger("app.ai")

class AnswerEvaluationError(Exception):
    """Raised when the AI model fails to generate a valid structured answer evaluation."""
    pass

class AnswerEvaluator:
    def __init__(self):
        self.client = GeminiClient()

    def evaluate(self, question: str, expected_topics: list[str], answer: str) -> AnswerEvaluationSchema:
        # build prompt
        prompt = PromptBuilder.evaluate_answer(question, expected_topics, answer)
        
        # query gemini structured output endpoint
        try:
            raw_response = self.client.generate_structured(prompt, AnswerEvaluationSchema)
        except Exception as e:
            logger.error(f"Gemini client content generation failed for answer evaluation: {str(e)}")
            raise AnswerEvaluationError(f"Gemini model query failed: {str(e)}")
            
        # parse and validate response
        try:
            parsed_data = json.loads(raw_response)
            return AnswerEvaluationSchema(**parsed_data)
        except Exception as e:
            logger.error(
                f"Validation against AnswerEvaluationSchema failed. "
                f"Raw Response: '{raw_response}'. Error: {str(e)}"
            )
            raise AnswerEvaluationError(f"Structured AI output parsing failed: {str(e)}")
