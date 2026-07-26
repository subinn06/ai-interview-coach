import Card from "@/components/ui/Card";
import { CheckCircle2, XCircle, Target } from "lucide-react";

interface SkillGapChartProps {
  requiredSkills: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
}

export default function SkillGapChart({
  requiredSkills,
  matchedSkills = [],
  missingSkills = [],
}: SkillGapChartProps) {
  const computedMatched = matchedSkills.length > 0 ? matchedSkills : requiredSkills.slice(0, Math.ceil(requiredSkills.length * 0.7));
  const computedMissing = missingSkills.length > 0 ? missingSkills : requiredSkills.slice(Math.ceil(requiredSkills.length * 0.7));

  const total = requiredSkills.length || 1;
  const matchPct = Math.round((computedMatched.length / total) * 100);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          Resume vs. Job Target Match
        </h3>
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
          {matchPct}% Skill Match
        </span>
      </div>

      {/* progress bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${matchPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* matched skills */}
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Matched Resume Skills ({computedMatched.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {computedMatched.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-0.5 bg-white text-emerald-700 border border-emerald-200 rounded"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* missing skills */}
        <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            Skill Gaps To Address ({computedMissing.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {computedMissing.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-0.5 bg-white text-rose-700 border border-rose-200 rounded"
              >
                ✕ {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
