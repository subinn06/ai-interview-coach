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
        return self.db.query(Resume).filter(Resume.id == resume_id).first()

    def get_by_user(self, user_id: UUID) -> list[Resume]:
        return self.db.query(Resume).filter(Resume.user_id == user_id).all()

    def delete(self, resume: Resume) -> None:
        self.db.delete(resume)
        self.db.commit()
