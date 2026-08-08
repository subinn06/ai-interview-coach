import Card from "@/components/ui/Card";
import { Code, MessageSquare, Cpu, ShieldCheck } from "lucide-react";

interface ScoreBreakdownProps {
  technical: number;
  communication: number;
  problemSolving: number;
  confidence: number;
}

export default function ScoreBreakdown({
  technical,
  communication,
  problemSolving,
  confidence,
}: ScoreBreakdownProps) {
  const dimensions = [
    { label: "Technical Knowledge", value: technical, icon: Code, color: "from-blue-500 to-indigo-600" },
    { label: "Communication Clarity", value: communication, icon: MessageSquare, color: "from-purple-500 to-pink-600" },
    { label: "Problem Solving Approach", value: problemSolving, icon: Cpu, color: "from-emerald-500 to-teal-600" },
    { label: "Confidence & Delivery", value: confidence, icon: ShieldCheck, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-base font-bold text-slate-900">Score Dimension Breakdown</h3>

      <div className="space-y-4">
        {dimensions.map((dim, idx) => {
          const Icon = dim.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  {dim.label}
                </span>
                <span>{dim.value}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${dim.color} h-2.5 rounded-full transition-all duration-700`}
                  style={{ width: `${dim.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
