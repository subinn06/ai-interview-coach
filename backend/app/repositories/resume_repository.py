from sqlalchemy.orm import Session
from app.models.resume import Resume
from uuid import UUID

class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, resume: Resume) -> Resume:
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get_by_id(self, resume_id: UUID) -> Resume | None:
        val_id = UUID(resume_id) if isinstance(resume_id, str) else resume_id
        return self.db.query(Resume).filter(Resume.id == val_id).first()

    def get_by_user(self, user_id: UUID) -> list[Resume]:
        val_id = UUID(user_id) if isinstance(user_id, str) else user_id
        return self.db.query(Resume).filter(Resume.user_id == val_id).all()

    def delete(self, resume: Resume) -> None:
        self.db.delete(resume)
        self.db.commit()
