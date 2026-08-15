from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def get_by_id(self, user_id):
        import uuid
        val_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
        return (
            self.db.query(User)
            .filter(User.id == val_id)
            .first()
        )

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user