import { useAuthStore } from "@/store/auth-store";
import {
  useDashboardSummary,
  useSkillBreakdown,
} from "../hooks/useDashboard";
import StatCard from "@/components/common/StatCard";
import { SkeletonCard } from "@/components/common/Skeleton";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";
import Card from "@/components/ui/Card";
import {
  MessageSquare,
  Award,
  Trophy,
  Activity,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: skills, isLoading: isSkillsLoading } = useSkillBreakdown();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white mb-3">
            <Zap className="w-3.5 h-3.5" />
            AI Interview Coach Active
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || "Candidate"}!
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Track your mock technical session performance, ATS scores, and skill progression in real-time.
          </p>
        </div>
      </div>

      {/* summary statistics cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSummaryLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Interviews"
              value={summary?.total_interviews ?? 0}
              icon={MessageSquare}
              subtitle="Completed sessions"
              iconColor="text-blue-600 bg-blue-50"
            />
            <StatCard
              title="Average Score"
              value={`${summary?.average_score ?? 0}%`}
              icon={Award}
              trend="+5% improvement"
              iconColor="text-indigo-600 bg-indigo-50"
            />
            <StatCard
              title="Best Score"
              value={`${summary?.best_score ?? 0}%`}
              icon={Trophy}
              subtitle="Personal high score"
              iconColor="text-amber-600 bg-amber-50"
            />
            <StatCard
              title="Latest Score"
              value={`${summary?.latest_score ?? 0}%`}
              icon={Activity}
              subtitle="Most recent session"
              iconColor="text-emerald-600 bg-emerald-50"
            />
          </>
        )}
      </div>

      {/* quick actions */}
      <QuickActions />

      {/* skills breakdown & recent activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* category skill ratings */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Skill Performance Breakdown
          </h3>
          {isSkillsLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Technical Knowledge</span>
                  <span className="text-blue-600">{skills?.technical ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skills?.technical ?? 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Communication & Clarity</span>
                  <span className="text-indigo-600">{skills?.communication ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skills?.communication ?? 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Problem Solving</span>
                  <span className="text-purple-600">{skills?.problem_solving ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skills?.problem_solving ?? 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Delivery Confidence</span>
                  <span className="text-emerald-600">{skills?.confidence ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skills?.confidence ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* recent activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
