import Card from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";
import type { SkillAnalytics } from "../types/report.types";

interface SkillChartProps {
  skills?: SkillAnalytics;
}

export default function SkillChart({ skills }: SkillChartProps) {
  const data = skills || {
    technical: 0,
    communication: 0,
    problem_solving: 0,
    confidence: 0,
  };

  const dimensions = [
    { name: "Technical", score: data.technical, color: "bg-blue-500" },
    { name: "Communication", score: data.communication, color: "bg-purple-500" },
    { name: "Problem Solving", score: data.problem_solving, color: "bg-emerald-500" },
    { name: "Confidence", score: data.confidence, color: "bg-amber-500" },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Skill Profile Breakdown
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {dimensions.map((item, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-600 block">{item.name}</span>
            <div className="text-2xl font-black text-slate-900">{item.score}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-1.5 rounded-full transition-all duration-700`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
