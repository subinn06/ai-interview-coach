from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, create_refresh_token
from app.models.user import User

class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    # register
    def register(self, email, full_name, password):
        if self.repo.get_by_email(email):
            raise ValueError("User already exists")

        user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
        )

        return self.repo.create(user)

    # login
    def login(self, email, password):
        user = self.repo.get_by_email(email)
        if not user:
            return None

        if not verify_password(
            password,
            user.password_hash,
        ):
            return None

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }