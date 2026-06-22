from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin

class User(UUIDMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    full_name: Mapped[str] = mapped_column(String(255))

    password_hash: Mapped[str] = mapped_column(String)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)