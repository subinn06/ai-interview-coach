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

# token response payload
class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# token refresh request
class TokenRefreshRequest(BaseModel):
    refresh_token: str

class UserUpdate(BaseModel):
    full_name: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str