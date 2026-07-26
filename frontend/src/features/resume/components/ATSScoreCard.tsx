import Card from "@/components/ui/Card";
import { Award, CheckCircle2, AlertCircle } from "lucide-react";

interface ATSScoreCardProps {
  score: number;
}

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  const getRating = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200", bar: "bg-emerald-600" };
    if (score >= 75) return { label: "Good", color: "text-blue-600 bg-blue-50 border-blue-200", bar: "bg-blue-600" };
    if (score >= 60) return { label: "Fair", color: "text-amber-600 bg-amber-50 border-amber-200", bar: "bg-amber-500" };
    return { label: "Needs Improvement", color: "text-red-600 bg-red-50 border-red-200", bar: "bg-red-500" };
  };

  const rating = getRating(score);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          ATS Compatibility Score
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${rating.color}`}>
          {rating.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-extrabold text-slate-900">{score}%</span>
        <span className="text-xs text-slate-500 font-medium">Estimated ATS Pass Rate</span>
      </div>

      {/* progress bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${rating.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
        {score >= 75 ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        )}
        <span>
          {score >= 75
            ? "Your resume formatting and technical terminology align well with modern Applicant Tracking Systems."
            : "Consider incorporating more target keywords, measurable impacts, and standard section headers."}
        </span>
      </p>
    </Card>
  );
}
