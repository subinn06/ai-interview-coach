from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.interview import (
    InterviewStartRequest,
    InterviewStartResponse,
    AnswerSubmitRequest,
    AnswerSubmitResponse,
    InterviewSessionResponse,
    InterviewSessionDetailResponse
)
from app.db.dependencies import get_db
from app.services.interview_service import InterviewService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)

@router.post("/start", response_model=InterviewStartResponse, status_code=status.HTTP_201_CREATED)
def start_interview(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = InterviewService(db)
    try:
        session, first_q = service.start_interview(current_user.id, payload)
        return {
            "session_id": session.id,
            "first_question": first_q
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI interview question generation failed: {str(e)}"
        )

@router.post("/{session_id}/answer", response_model=AnswerSubmitResponse)
def submit_answer(
    session_id: UUID,
    payload: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = InterviewService(db)
    try:
        answer, next_q, eval_result = service.submit_answer(current_user.id, session_id, payload)
        
        return {
            "evaluation": {
                "score": answer.score,
                "feedback": answer.feedback,
                "strengths": eval_result.strengths,
                "weaknesses": eval_result.weaknesses,
                "improvements": eval_result.improvements
            },
            "next_question": next_q
        }
    except ValueError as e:
        # fsm state transition protection
        if "already completed" in str(e) or "already been answered" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI answer evaluation failed: {str(e)}"
        )

@router.post("/{session_id}/finish", response_model=InterviewSessionResponse)
def finish_interview(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = InterviewService(db)
    try:
        return service.finish_interview(current_user.id, session_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("", response_model=list[InterviewSessionResponse])
def list_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = InterviewService(db)
    return service.get_history(current_user.id)

@router.get("/{session_id}", response_model=InterviewSessionDetailResponse)
def get_interview(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = InterviewService(db)
    session = service.get_session(current_user.id, session_id)
    if not session:
        # standard security strategy
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    return session
