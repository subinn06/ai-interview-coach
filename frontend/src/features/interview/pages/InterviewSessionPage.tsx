import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  useInterview,
  useSubmitAnswer,
  useFinishInterview,
} from "../hooks/useInterview";
import QuestionCard from "../components/QuestionCard";
import AnswerEditor from "../components/AnswerEditor";
import FeedbackCard from "../components/FeedbackCard";
import TimerCounter from "../components/TimerCounter";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/common/EmptyState";
import { Zap } from "lucide-react";
import type {
  InterviewQuestion,
  AnswerEvaluation,
} from "../types/interview.types";

export default function InterviewSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // pick up first question passed via navigation state if available
  const passedFirstQuestion = location.state?.firstQuestion as InterviewQuestion | undefined;

  const { data: session, isLoading, isError } = useInterview(sessionId);
  const submitAnswerMutation = useSubmitAnswer(sessionId || "");
  const finishMutation = useFinishInterview();

  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(
    passedFirstQuestion || null
  );
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // sync current question from session data if not set yet
  if (session && !currentQuestion && !isFinished) {
    const unanswered = session.questions.find((q) => !q.answer);
    if (unanswered) {
      setCurrentQuestion({
        id: unanswered.id,
        question: unanswered.question,
        category: unanswered.category,
        order_number: unanswered.order_number,
      });
    } else if (session.status === "completed") {
      setIsFinished(true);
    }
  }

  if (isLoading && !currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !sessionId) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <EmptyState
          icon={Zap}
          title="Interview Session Not Found"
          description="Unable to load interview session. It may have expired or been removed."
          actionLabel="Return to Setup"
          onAction={() => navigate("/interview/setup")}
        />
      </div>
    );
  }

  const answeredCount = session?.questions.filter((q) => Boolean(q.answer)).length || 0;
  const totalQuestions = session?.questions.length || 5;
  const currentNumber = currentQuestion ? currentQuestion.order_number : answeredCount + 1;
  const isLastQuestion = currentNumber >= totalQuestions;

  const handleSubmitAnswer = (answerText: string) => {
    if (!currentQuestion) return;

    toast.info("AI is evaluating your response...");
    submitAnswerMutation.mutate(
      {
        question_id: currentQuestion.id,
        answer: answerText,
      },
      {
        onSuccess: (res) => {
          setLastEvaluation(res.evaluation);
          if (res.next_question) {
            // save next question for when candidate clicks continue
            setCurrentQuestion(res.next_question);
          } else {
            setCurrentQuestion(null);
            setIsFinished(true);
          }
          toast.success("Answer evaluated!");
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.detail || "Failed to submit answer for AI evaluation.";
          toast.error(message);
        },
      }
    );
  };

  const handleContinue = () => {
    setLastEvaluation(null);

    if (isFinished || !currentQuestion) {
      // complete interview and navigate to report
      finishMutation.mutate(sessionId, {
        onSuccess: () => {
          toast.success("Interview completed! Generating final report...");
          navigate(`/interview/report/${sessionId}`);
        },
        onError: () => {
          navigate(`/interview/report/${sessionId}`);
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* top status header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Live AI Technical Interview
          </span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200 uppercase">
            {session?.difficulty || "Medium"}
          </span>
        </div>

        <TimerCounter />
      </div>

      {/* progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Progress ({answeredCount} of {totalQuestions} completed)</span>
          <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* main active q&a interface */}
      {lastEvaluation ? (
        <FeedbackCard
          evaluation={lastEvaluation}
          onNext={handleContinue}
          isLastQuestion={isLastQuestion || isFinished}
          isLoadingNext={finishMutation.isPending}
        />
      ) : currentQuestion ? (
        <div className="space-y-6">
          <QuestionCard
            questionText={currentQuestion.question}
            category={currentQuestion.category}
            difficulty={session?.difficulty || "Medium"}
            currentNumber={currentNumber}
            totalQuestions={totalQuestions}
          />
          <AnswerEditor
            onSubmit={handleSubmitAnswer}
            isLoading={submitAnswerMutation.isPending}
          />
        </div>
      ) : (
        <EmptyState
          icon={Zap}
          title="Interview Completed"
          description="All questions have been answered. Click below to view your full feedback report."
          actionLabel="View Comprehensive Report"
          onAction={() => navigate(`/interview/report/${sessionId}`)}
        />
      )}
    </div>
  );
}
