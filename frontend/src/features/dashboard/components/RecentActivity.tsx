import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle, Clock, History } from "lucide-react";
import { useInterviews } from "@/features/interview/hooks/useInterview";

export default function RecentActivity() {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useInterviews();

  const recentSessions = sessions?.slice(0, 3) || [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Recent Activity
        </h3>
        {recentSessions.length > 0 && (
          <button
            onClick={() => navigate("/interview/history")}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : recentSessions.length === 0 ? (
        <div className="text-center py-6 space-y-3">
          <History className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your recent practice activity will appear here.
          </p>
          <Button
            onClick={() => navigate("/interview/setup")}
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            Start Interview
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentSessions.map((s) => {
            const isCompleted = s.status === "completed";
            const score = s.total_score || 0;
            let scoreColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (score < 50) scoreColor = "bg-rose-50 text-rose-700 border-rose-200";
            else if (score < 75) scoreColor = "bg-amber-50 text-amber-700 border-amber-200";

            return (
              <div
                key={s.id}
                onClick={() => navigate(isCompleted ? `/interview/report/${s.id}` : `/interview/${s.id}`)}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Technical Mock Session #{s.id.substring(0, 6)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(s.started_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${scoreColor}`}>
                  {isCompleted ? `${score}% Score` : "In Progress"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
