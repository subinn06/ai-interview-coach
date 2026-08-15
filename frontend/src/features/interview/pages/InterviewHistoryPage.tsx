import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, History, Eye, Award, Clock, Trash2 } from "lucide-react";
import { useInterviews, useDeleteInterview } from "../hooks/useInterview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/Skeleton";

import { getErrorMessage } from "@/lib/error-handler";

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const { data: sessions, isLoading, isError } = useInterviews();
  const deleteMutation = useDeleteInterview();

  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this interview history record?")) {
      deleteMutation.mutate(sessionId, {
        onSuccess: () => {
          toast.success("Interview session deleted.");
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err));
        },
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Interview Practice History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past mock interview sessions, scores, and AI feedback reports.
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

      {/* history grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <EmptyState
          icon={History}
          title="Failed to Load History"
          description="Unable to fetch your past interview sessions. Please check server status."
        />
      ) : !sessions || sessions.length === 0 ? (
        <EmptyState
          icon={History}
          title="You haven't completed an interview yet."
          description="Start a mock technical interview to practice answering role-specific questions and get AI feedback."
          actionLabel="Start Interview"
          onAction={() => navigate("/interview/setup")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => {
            const isCompleted = s.status === "completed";
            const score = s.total_score || 0;

            let scoreColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (score < 50) scoreColor = "bg-rose-50 text-rose-700 border-rose-200";
            else if (score < 75) scoreColor = "bg-amber-50 text-amber-700 border-amber-200";

            return (
              <Card
                key={s.id}
                className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-slate-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      #{s.id.substring(0, 8)}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                      {s.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-base font-bold text-slate-900">
                        {isCompleted ? `${score}% Score` : "In Progress"}
                      </span>
                    </div>
                    {isCompleted && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${scoreColor}`}>
                        Completed
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Started {new Date(s.started_at).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    onClick={() => navigate(isCompleted ? `/interview/report/${s.id}` : `/interview/${s.id}`)}
                    size="sm"
                    variant="secondary"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isCompleted ? "View Report" : "Resume Session"}
                  </Button>

                  <Button
                    onClick={() => handleDeleteSession(s.id)}
                    size="sm"
                    variant="ghost"
                    className="px-2.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete Interview History"
                    aria-label={`Delete interview history record ${s.id.substring(0, 8)}`}
                    isLoading={deleteMutation.isPending && deleteMutation.variables === s.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
