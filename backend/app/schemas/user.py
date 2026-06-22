from uuid import UUID
from pydantic import BaseModel, EmailStr

# register request
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

# login request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# response
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str

    class Config:
        from_attributes = True