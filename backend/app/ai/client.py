from google import genai
from google.genai import types
from app.core.config import settings

class GeminiClient:
    def __init__(self):
        # initialize genai client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate(self, prompt: str) -> str:
        # standard content generation
        response = self.client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )
        if response.text is None:
            return ""
        return response.text

    def generate_structured(self, prompt: str, schema) -> str:
        # structured content generation returning validated json matching the schema
        response = self.client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
            )
        )
        if response.text is None:
            return ""
        return response.text
