from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone

from app.models.feedback_report import FeedbackReport
from app.models.interview_session import InterviewSession
from app.models.analytics_event import AnalyticsEvent
from app.ai.feedback_generator import FeedbackGenerator

class FeedbackService:
    def __init__(self, db: Session):
        self.db = db
        self.generator = FeedbackGenerator()

    def generate_report(self, user_id: UUID, session_id: UUID) -> FeedbackReport:
        # fetch session and verify ownership
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()
        if not session:
            raise ValueError("Interview session not found")

        # gather questions and answers history
        qa_history = []
        for q in session.questions:
            answer_text = q.answer.answer if q.answer else ""
            score = q.answer.score if q.answer else 0
            feedback = q.answer.feedback if q.answer else ""
            
            qa_history.append({
                "question": q.question,
                "category": q.category,
                "expected_topics": q.expected_topics,
                "candidate_answer": answer_text,
                "score": score,
                "feedback": feedback
            })

        # call ai feedback generator
        report_data = self.generator.generate(qa_history)

        # clear existing report if any
        old_report = self.db.query(FeedbackReport).filter(
            FeedbackReport.session_id == session_id
        ).first()
        if old_report:
            self.db.delete(old_report)
            self.db.commit()

        # save report to db
        report = FeedbackReport(
            session_id=session_id,
            overall_score=report_data.overall_score,
            technical_score=report_data.technical_score,
            communication_score=report_data.communication_score,
            problem_solving_score=report_data.problem_solving_score,
            confidence_score=report_data.confidence_score,
            summary=report_data.summary,
            strengths=report_data.strengths,
            improvement_areas=report_data.improvement_areas,
            recommended_topics=[topic.model_dump() for topic in report_data.recommended_topics]
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        # log report_generated analytics event
        event = AnalyticsEvent(
            user_id=user_id,
            event_type="REPORT_GENERATED",
            metadata_json={
                "session_id": str(session_id),
                "overall_score": report_data.overall_score
            }
        )
        self.db.add(event)
        self.db.commit()

        return report
