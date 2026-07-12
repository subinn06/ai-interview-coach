import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    job_description_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_descriptions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    required_skills: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    preferred_skills: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    experience_level: Mapped[str] = mapped_column(String(255), nullable=False)

    responsibilities: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    keywords: Mapped[list[str]] = mapped_column(JSONB, nullable=False)

    summary: Mapped[str] = mapped_column(Text, nullable=False)

    raw_response: Mapped[dict] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    job_description = relationship("JobDescription", back_populates="analysis")
