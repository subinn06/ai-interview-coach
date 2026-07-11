import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    resume_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False
    )

    ats_score: Mapped[int] = mapped_column(Integer, nullable=False)

    strengths: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    weaknesses: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    missing_skills: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    summary: Mapped[str] = mapped_column(Text, nullable=False)

    raw_response: Mapped[dict] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    resume = relationship("Resume", back_populates="analyses")
