import json
import logging
from app.ai.client import GeminiClient
from app.ai.prompts import PromptBuilder
from app.ai.schemas import ResumeAnalysisSchema

# logger for tracking ai response failures
logger = logging.getLogger("app.ai")

class AIAnalysisError(Exception):
    """Raised when the AI model fails to generate a valid structured response."""
    pass

class ResumeAnalyzer:
    def __init__(self):
        self.client = GeminiClient()

    def analyze(self, resume_text: str) -> ResumeAnalysisSchema:
        # build prompt
        prompt = PromptBuilder.resume_analysis(resume_text)
        
        # query gemini structured output endpoint
        try:
            raw_response = self.client.generate_structured(prompt, ResumeAnalysisSchema)
        except Exception as e:
            logger.error(f"Gemini client content generation failed: {str(e)}")
            raise AIAnalysisError(f"Gemini model query failed: {str(e)}")
        
        # parse and validate the response
        try:
            parsed_data = json.loads(raw_response)
            return ResumeAnalysisSchema(**parsed_data)
        except Exception as e:
            # log the raw response
            logger.error(
                f"Validation against ResumeAnalysisSchema failed. "
                f"Raw Response: '{raw_response}'. Error: {str(e)}"
            )
            raise AIAnalysisError(f"Structured AI output parsing failed: {str(e)}")
