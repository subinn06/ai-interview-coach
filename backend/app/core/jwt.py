from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

from app.core.config import settings

def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update({
        "type": "access",
        "exp": expire
    })
    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

def create_refresh_token(data: dict):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=7  # refresh tokens expire in 7 days
    )
    payload.update({
        "type": "refresh",
        "exp": expire
    })
    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None