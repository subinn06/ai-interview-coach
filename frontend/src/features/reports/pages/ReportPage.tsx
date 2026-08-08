import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import { useReport } from "../hooks/useReports";
import OverallScore from "../components/OverallScore";
import ScoreBreakdown from "../components/ScoreBreakdown";
import StrengthsCard from "../components/StrengthsCard";
import ImprovementCard from "../components/ImprovementCard";
import RecommendedTopics from "../components/RecommendedTopics";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: report, isLoading, isError } = useReport(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/reports")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports History
        </Button>
        <EmptyState
          icon={FileText}
          title="Report Not Found"
          description="The requested AI evaluation report could not be loaded."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to AI Reports History
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Comprehensive Evaluation Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generated {report.created_at ? new Date(report.created_at).toLocaleString() : "Recently"}
          </p>
        </div>

        <Button
          onClick={() => navigate("/interview/setup")}
          size="sm"
          className="flex items-center gap-1.5"
        >
          Start Another Mock Session
        </Button>
      </div>

      {/* hero overall score gauge */}
      <OverallScore score={report.overall_score} />

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column - dimension breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <ScoreBreakdown
            technical={report.technical_score}
            communication={report.communication_score}
            problemSolving={report.problem_solving_score}
            confidence={report.confidence_score}
          />
        </div>

        {/* right column - summary, strengths, improvements, topics */}
        <div className="lg:col-span-2 space-y-6">
          {/* executive summary card */}
          {report.summary && (
            <Card className="p-6 space-y-2 border-purple-100 bg-purple-50/20">
              <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">
                Executive Performance Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {report.summary}
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrengthsCard strengths={report.strengths} />
            <ImprovementCard improvements={report.improvement_areas} />
          </div>

          <RecommendedTopics topics={report.recommended_topics} />
        </div>
      </div>
    </div>
  );
}
