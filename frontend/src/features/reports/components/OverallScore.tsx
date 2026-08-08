import Card from "@/components/ui/Card";
import { Sparkles, Award } from "lucide-react";

interface OverallScoreProps {
  score: number;
}

export default function OverallScore({ score }: OverallScoreProps) {
  let gradeText = "Needs Practice";
  let badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
  let gradientColor = "from-amber-500 to-orange-500";

  if (score >= 85) {
    gradeText = "Outstanding Performance";
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    gradientColor = "from-emerald-500 to-teal-600";
  } else if (score >= 70) {
    gradeText = "Strong Competency";
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    gradientColor = "from-blue-600 to-indigo-600";
  }

  return (
    <Card className="p-8 bg-slate-900 text-white shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles className="w-4 h-4" />
            AI Overall Evaluation
          </span>
          <h2 className="text-3xl font-black text-white">{gradeText}</h2>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Multi-dimensional rating calculated from technical accuracy, communication clarity, problem-solving approach, and confidence.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
          <div className="relative flex items-center justify-center">
            <div className={`text-5xl font-black bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
              {score}%
            </div>
          </div>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wider border ${badgeColor}`}>
            <Award className="w-3 h-3 inline mr-1" />
            Score Tier
          </span>
        </div>
      </div>
    </Card>
  );
}
