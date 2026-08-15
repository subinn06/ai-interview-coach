from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.oauth import oauth2_scheme
from app.db.dependencies import get_db
from app.models.user import User
from app.core.jwt import decode_token

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    import uuid
    val_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    user = (
        db.query(User)
        .filter(User.id == val_id)
        .first()
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    return user