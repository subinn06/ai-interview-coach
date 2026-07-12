import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, String, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False
    )

    question: Mapped[str] = mapped_column(Text, nullable=False)

    category: Mapped[str] = mapped_column(String(255), nullable=False)

    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)

    order_number: Mapped[int] = mapped_column(Integer, nullable=False)

    expected_topics: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    session = relationship("InterviewSession", back_populates="questions")
    
    answer = relationship(
        "InterviewAnswer",
        back_populates="question",
        cascade="all, delete-orphan",
        uselist=False
    )
