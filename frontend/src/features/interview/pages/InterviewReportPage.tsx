import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, CheckCircle2, RefreshCw, Sparkles, HelpCircle } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";

export default function InterviewReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, isError } = useInterview(sessionId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Button
          onClick={() => navigate("/interviews")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Button>
        <EmptyState
          icon={Award}
          title="Report Not Found"
          description="The requested interview feedback report could not be loaded."
        />
      </div>
    );
  }

  const overallScore = session.total_score || 0;

  let scoreGrade = "Needs Practice";
  let gradeColor = "bg-amber-50 text-amber-700 border-amber-200";
  if (overallScore >= 80) {
    scoreGrade = "Excellent Performance";
    gradeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (overallScore >= 60) {
    scoreGrade = "Solid Foundation";
    gradeColor = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/interviews")}
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Interview History
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            AI Interview Evaluation Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Session ID: <code className="font-mono">{session.id.substring(0, 8)}</code> • Completed{" "}
            {session.completed_at ? new Date(session.completed_at).toLocaleString() : "Recently"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/interview/setup")}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Mock Session
          </Button>
        </div>
      </div>

      {/* hero score gauge card */}
      <Card className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-4 h-4" />
              Overall Technical Score
            </span>
            <h2 className="text-3xl font-black text-white">{scoreGrade}</h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Based on answer accuracy, technical depth, and alignment with job description requirements.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
            <div className="text-5xl font-black text-white tracking-tight">
              {overallScore}%
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wider ${gradeColor}`}>
              {session.difficulty} difficulty
            </span>
          </div>
        </div>
      </Card>

      {/* question breakdown list */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          Question Breakdown & AI Feedback ({session.questions.length})
        </h3>

        {session.questions.map((q, idx) => {
          const ans = q.answer;
          const score = ans ? ans.score : 0;

          let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
          if (score < 50) badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
          else if (score < 75) badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

          return (
            <Card key={q.id} className="p-6 space-y-4">
              {/* question header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {q.category}
                  </span>
                </div>
                {ans && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${badgeColor}`}>
                    Score: {score}%
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{q.question}</span>
              </h4>

              {/* candidate answer */}
              {ans ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                    <span className="font-bold text-slate-500 block mb-1">Your Answer:</span>
                    {ans.answer}
                  </div>

                  <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Feedback:
                    </span>
                    {ans.feedback}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No answer provided.</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
