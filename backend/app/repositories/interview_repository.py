from sqlalchemy.orm import Session
from uuid import UUID
from app.models.interview_session import InterviewSession
from app.models.interview_question import InterviewQuestion
from app.models.interview_answer import InterviewAnswer

class InterviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, session: InterviewSession) -> InterviewSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_session(self, session_id: UUID) -> InterviewSession | None:
        val_id = UUID(session_id) if isinstance(session_id, str) else session_id
        return self.db.query(InterviewSession).filter(InterviewSession.id == val_id).first()

    def save_questions(self, questions: list[InterviewQuestion]) -> list[InterviewQuestion]:
        self.db.add_all(questions)
        self.db.commit()
        for q in questions:
            self.db.refresh(q)
        return questions

    def get_question(self, question_id: UUID) -> InterviewQuestion | None:
        val_id = UUID(question_id) if isinstance(question_id, str) else question_id
        return self.db.query(InterviewQuestion).filter(InterviewQuestion.id == val_id).first()

    def save_answer(self, answer: InterviewAnswer) -> InterviewAnswer:
        self.db.add(answer)
        self.db.commit()
        self.db.refresh(answer)
        return answer

    def get_next_unanswered_question(self, session_id: UUID) -> InterviewQuestion | None:
        val_id = UUID(session_id) if isinstance(session_id, str) else session_id
        return (
            self.db.query(InterviewQuestion)
            .outerjoin(InterviewAnswer)
            .filter(InterviewQuestion.session_id == val_id)
            .filter(InterviewAnswer.id == None)
            .order_by(InterviewQuestion.order_number.asc())
            .first()
        )

    def get_user_sessions(self, user_id: UUID) -> list[InterviewSession]:
        val_id = UUID(user_id) if isinstance(user_id, str) else user_id
        return (
            self.db.query(InterviewSession)
            .filter(InterviewSession.user_id == val_id)
            .order_by(InterviewSession.started_at.desc())
            .all()
        )

    def delete_session(self, session: InterviewSession) -> None:
        self.db.delete(session)
        self.db.commit()
