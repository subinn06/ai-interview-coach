from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional

from app.repositories.interview_repository import InterviewRepository
from app.repositories.resume_repository import ResumeRepository
from app.repositories.job_repository import JobRepository
from app.ai.interview_generator import InterviewGenerator
from app.ai.answer_evaluator import AnswerEvaluator
from app.ai.schemas import AnswerEvaluationSchema
from app.models.interview_session import InterviewSession
from app.models.interview_question import InterviewQuestion
from app.models.interview_answer import InterviewAnswer
from app.schemas.interview import InterviewStartRequest, AnswerSubmitRequest

from app.services.analytics_service import AnalyticsService
from app.services.feedback_service import FeedbackService

class InterviewService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = InterviewRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.job_repo = JobRepository(db)
        self.generator = InterviewGenerator()
        self.evaluator = AnswerEvaluator()

    def start_interview(
        self,
        user_id: UUID,
        payload: InterviewStartRequest
    ) -> tuple[InterviewSession, InterviewQuestion]:
        # verify resume existence, ownership and analysis
        resume = self.resume_repo.get_by_id(payload.resume_id)
        if not resume or resume.user_id != user_id:
            raise ValueError("Resume not found")
        if not resume.analyses:
            raise ValueError("Resume must be analyzed before starting an interview")
        resume_analysis = resume.analyses[-1].raw_response

        # verify job description existence, ownership and analysis
        job = self.job_repo.get_by_id(payload.job_description_id)
        if not job or job.user_id != user_id:
            raise ValueError("Job description not found")
        if not job.analysis:
            raise ValueError("Job description must be analyzed before starting an interview")
        job_analysis = job.analysis.raw_response

        # call ai to generate 5 tailored questions
        questions_data = self.generator.generate_questions(
            resume_analysis=resume_analysis,
            job_analysis=job_analysis,
            difficulty=payload.difficulty,
            count=5
        )
        if not questions_data:
            raise ValueError("Failed to generate interview questions")

        # create interview session
        session = InterviewSession(
            user_id=user_id,
            resume_id=payload.resume_id,
            job_description_id=payload.job_description_id,
            difficulty=payload.difficulty,
            status="started"
        )
        session = self.repo.create_session(session)

        # track event
        AnalyticsService(self.repo.db).track_event(
            user_id, "INTERVIEW_STARTED", {"session_id": str(session.id), "difficulty": payload.difficulty}
        )

        # save generated questions
        db_questions = []
        for i, q in enumerate(questions_data):
            db_q = InterviewQuestion(
                session_id=session.id,
                question=q.question,
                category=q.category,
                difficulty=payload.difficulty,
                order_number=i + 1,
                expected_topics=q.expected_topics
            )
            db_questions.append(db_q)
        self.repo.save_questions(db_questions)

        # return session and first question
        return session, db_questions[0]

    def submit_answer(
        self,
        user_id: UUID,
        session_id: UUID,
        payload: AnswerSubmitRequest
    ) -> tuple[InterviewAnswer, Optional[InterviewQuestion], AnswerEvaluationSchema]:
        # fetch and validate session
        session = self.repo.get_session(session_id)
        if not session or session.user_id != user_id:
            raise ValueError("Interview session not found")
        
        # fsm state transition protection, block submissions for completed sessions
        if session.status == "completed":
            raise ValueError("Interview session is already completed")

        # fetch and validate question
        question = self.repo.get_question(payload.question_id)
        if not question or question.session_id != session_id:
            raise ValueError("Question does not belong to this session")

        # check if question has already been answered
        if question.answer:
            raise ValueError("Question has already been answered")

        # call ai answer evaluator
        eval_result = self.evaluator.evaluate(
            question=question.question,
            expected_topics=question.expected_topics,
            answer=payload.answer
        )

        # save candidate's answer
        answer = InterviewAnswer(
            question_id=question.id,
            answer=payload.answer,
            score=eval_result.score,
            feedback=eval_result.feedback
        )
        answer = self.repo.save_answer(answer)

        # fetch next unanswered question
        next_question = self.repo.get_next_unanswered_question(session_id)

        # if no more questions, transition fsm state to completed
        if not next_question:
            # calculate final total score
            scores = [q.answer.score for q in session.questions if q.answer is not None]
            if answer.score not in scores:
                scores.append(answer.score)
            
            session.status = "completed"
            session.total_score = round(sum(scores) / len(scores)) if scores else 0
            session.completed_at = datetime.now(timezone.utc)
            
            self.repo.db.add(session)
            self.repo.db.commit()

            # log event
            AnalyticsService(self.repo.db).track_event(
                user_id, "INTERVIEW_COMPLETED", {"session_id": str(session.id), "total_score": session.total_score}
            )

            # auto generate feedback report card
            try:
                FeedbackService(self.repo.db).generate_report(user_id, session.id)
            except Exception as e:
                # do not block the primary answer submission if report compiler encounters an api error
                pass

        return answer, next_question, eval_result

    def finish_interview(self, user_id: UUID, session_id: UUID) -> InterviewSession:
        session = self.repo.get_session(session_id)
        if not session or session.user_id != user_id:
            raise ValueError("Interview session not found")

        if session.status == "completed":
            return session

        # calculate final average score of answered questions so far
        scores = [q.answer.score for q in session.questions if q.answer is not None]
        
        session.status = "completed"
        session.total_score = round(sum(scores) / len(scores)) if scores else 0
        session.completed_at = datetime.now(timezone.utc)

        self.repo.db.add(session)
        self.repo.db.commit()
        self.repo.db.refresh(session)

        # log event
        AnalyticsService(self.repo.db).track_event(
            user_id, "INTERVIEW_COMPLETED", {"session_id": str(session.id), "total_score": session.total_score}
        )

        # auto generate feedback report card
        try:
            FeedbackService(self.repo.db).generate_report(user_id, session.id)
        except Exception:
            pass

        return session

    def get_session(self, user_id: UUID, session_id: UUID) -> Optional[InterviewSession]:
        session = self.repo.get_session(session_id)
        if not session or session.user_id != user_id:
            return None
        return session

    def get_history(self, user_id: UUID) -> list[InterviewSession]:
        return self.repo.get_user_sessions(user_id)

    def delete_session(self, user_id: UUID, session_id: UUID) -> None:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Interview session not found")
        self.repo.delete_session(session)
