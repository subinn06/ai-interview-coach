from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.db.dependencies import get_db
from app.services.auth_service import register_user, authenticate_user
from app.core.jwt import create_access_token

# auth router
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# register endpoint
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        user = register_user(
            db,
            email=payload.email,
            full_name=payload.full_name,
            password=payload.password
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# login endpoint
@router.post("/login")
def login(
    payload: UserLogin,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        email=payload.email,
        password=payload.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }