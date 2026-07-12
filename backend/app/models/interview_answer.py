import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interview_questions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    answer: Mapped[str] = mapped_column(Text, nullable=False)

    score: Mapped[int] = mapped_column(Integer, nullable=False)

    feedback: Mapped[str] = mapped_column(Text, nullable=False)

    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    question = relationship("InterviewQuestion", back_populates="answer")
