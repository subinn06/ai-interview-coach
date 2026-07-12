import json
import logging
from app.ai.client import GeminiClient
from app.ai.prompts import PromptBuilder
from app.ai.schemas import JobAnalysisSchema

# logger for tracking ai response failures
logger = logging.getLogger("app.ai")

class JobAnalysisError(Exception):
    """Raised when the AI model fails to generate a valid structured job analysis."""
    pass

class JobAnalyzer:
    def __init__(self):
        self.client = GeminiClient()

    def analyze(self, job_title: str, company_name: str, description: str) -> JobAnalysisSchema:
        # build prompt
        prompt = PromptBuilder.job_analysis(job_title, company_name, description)
        
        # query gemini structured output endpoint
        try:
            raw_response = self.client.generate_structured(prompt, JobAnalysisSchema)
        except Exception as e:
            logger.error(f"Gemini client content generation failed for job analysis: {str(e)}")
            raise JobAnalysisError(f"Gemini model query failed: {str(e)}")
        
        # parse and validate the response
        try:
            parsed_data = json.loads(raw_response)
            return JobAnalysisSchema(**parsed_data)
        except Exception as e:
            logger.error(
                f"Validation against JobAnalysisSchema failed. "
                f"Raw Response: '{raw_response}'. Error: {str(e)}"
            )
            raise JobAnalysisError(f"Structured AI output parsing failed: {str(e)}")
