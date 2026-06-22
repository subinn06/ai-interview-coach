from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password, verify_password

# register
def register_user(
    db: Session,
    email: str,
    full_name: str,
    password: str
):
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    if existing_user:
        raise ValueError(
            "User already exists"
        )
    user = User(
        email=email,
        full_name=full_name,
        password_hash=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# login
def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    if not user:
        return None
    if not verify_password(
        password,
        user.password_hash
    ):
        return None
    return user