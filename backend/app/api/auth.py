from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.schemas.user import (
    UserCreate,
    UserResponse,
    TokenData,
    TokenRefreshRequest,
    UserUpdate,
    PasswordChange
)
from app.core.security import verify_password, hash_password
from app.db.dependencies import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.core.auth import get_current_user
from app.core.jwt import decode_token, create_access_token, create_refresh_token
from app.models.user import User

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
    repo = UserRepository(db)
    service = AuthService(repo)
    try:
        user = service.register(
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
@router.post("/login", response_model=TokenData)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    repo = UserRepository(db)
    service = AuthService(repo)

    token_data = service.login(
        email=form_data.username,
        password=form_data.password,
    )

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return token_data

# refresh token endpoint
@router.post("/refresh", response_model=TokenData)
def refresh(
    payload: TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    token_payload = decode_token(payload.refresh_token)
    if not token_payload or token_payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
        
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
        
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    # generate new token pair
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# logout endpoint
@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user)
):
    return {"message": "Logged out successfully"}

# protected route
@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.full_name = payload.full_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    current_user.password_hash = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"message": "Password changed successfully"}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()