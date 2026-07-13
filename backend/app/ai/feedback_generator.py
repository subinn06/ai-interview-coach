import json
import logging
from app.ai.client import GeminiClient
from app.ai.prompts import PromptBuilder
from app.ai.schemas import FeedbackSchema

logger = logging.getLogger("app.ai")

class FeedbackGenerationError(Exception):
    """Raised when the AI model fails to generate a valid structured feedback report."""
    pass

class FeedbackGenerator:
    def __init__(self):
        self.client = GeminiClient()

    def generate(self, qa_history: list[dict]) -> FeedbackSchema:
        # build prompt
        prompt = PromptBuilder.generate_feedback(qa_history)
        
        # query gemini structured output endpoint
        try:
            raw_response = self.client.generate_structured(prompt, FeedbackSchema)
        except Exception as e:
            logger.error(f"Gemini client content generation failed for feedback report: {str(e)}")
            raise FeedbackGenerationError(f"Gemini model query failed: {str(e)}")
            
        # parse and validate response
        try:
            parsed_data = json.loads(raw_response)
            return FeedbackSchema(**parsed_data)
        except Exception as e:
            logger.error(
                f"Validation against FeedbackSchema failed. "
                f"Raw Response: '{raw_response}'. Error: {str(e)}"
            )
            raise FeedbackGenerationError(f"Structured AI output parsing failed: {str(e)}")
