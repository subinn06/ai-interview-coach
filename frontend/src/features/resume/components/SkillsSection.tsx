import Card from "@/components/ui/Card";
import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface SkillsSectionProps {
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
}

export default function SkillsSection({
  strengths,
  weaknesses,
  missingSkills,
}: SkillsSectionProps) {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-base font-bold text-slate-900">Extracted Skills & Terminology</h3>

      {/* identified strengths */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Technical Strengths
        </h4>
        <div className="flex flex-wrap gap-2">
          {strengths.length > 0 ? (
            strengths.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None detected</span>
          )}
        </div>
      </div>

      {/* areas of weakness */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Improvement Areas
        </h4>
        <div className="flex flex-wrap gap-2">
          {weaknesses.length > 0 ? (
            weaknesses.map((item, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None detected</span>
          )}
        </div>
      </div>

      {/* missing keywords */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-rose-600" />
          Recommended Missing Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg"
              >
                + {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None missing</span>
          )}
        </div>
      </div>
    </Card>
  );
}
