import { useNavigate } from "react-router-dom";
import { FileText, Plus, Award, ArrowRight, Clock } from "lucide-react";
import {
  useReports,
  useProgressAnalytics,
  useSkillAnalytics,
} from "../hooks/useReports";
import PerformanceChart from "../components/PerformanceChart";
import SkillChart from "../components/SkillChart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/Skeleton";

export default function ReportsPage() {
  const navigate = useNavigate();

  const { data: reports, isLoading: loadingReports } = useReports();
  const { data: progress } = useProgressAnalytics();
  const { data: skills } = useSkillAnalytics();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            AI Coaching Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your mock interview score evolution and multi-dimensional skill profiles over time.
          </p>
        </div>

        <Button
          onClick={() => navigate("/interview/setup")}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Start New Interview
        </Button>
      </div>

      {/* analytics visualization section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={progress || []} />
        <SkillChart skills={skills} />
      </div>

      {/* reports history list */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Individual Evaluation Reports
        </h2>

        {loadingReports ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : !reports || reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Your interview reports will appear here."
            description="Complete your first AI technical mock interview to receive a structured evaluation report."
            actionLabel="Start Interview"
            onAction={() => navigate("/interview/setup")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => {
              const score = r.overall_score;
              let scoreColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
              if (score < 50) scoreColor = "bg-rose-50 text-rose-700 border-rose-200";
              else if (score < 75) scoreColor = "bg-amber-50 text-amber-700 border-amber-200";

              return (
                <Card
                  key={r.id}
                  className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-slate-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Report #{r.id.substring(0, 8)}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${scoreColor}`}>
                        {score}% Score
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {r.summary || "Structured evaluation report card."}
                    </p>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {r.created_at ? new Date(r.created_at).toLocaleString() : "Recently"}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <Button
                      onClick={() => navigate(`/reports/${r.id}`)}
                      size="sm"
                      variant="secondary"
                      className="w-full flex items-center justify-center gap-1.5 text-xs"
                    >
                      <span>View Full Evaluation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
