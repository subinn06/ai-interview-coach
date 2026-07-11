from pydantic import BaseModel
from uuid import UUID

class ResumeResponse(BaseModel):
    id: UUID
    filename: str

    class Config:
        from_attributes = True