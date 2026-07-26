import Card from "@/components/ui/Card";
import { CheckSquare, Sparkles } from "lucide-react";

interface ResponsibilitiesListProps {
  responsibilities: string[];
  experienceLevel?: string;
  summary?: string;
}

export default function ResponsibilitiesList({
  responsibilities,
  experienceLevel,
  summary,
}: ResponsibilitiesListProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          Key Responsibilities & Expectations
        </h3>
        {experienceLevel && (
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
            {experienceLevel}
          </span>
        )}
      </div>

      {summary && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>{summary}</span>
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {responsibilities.length > 0 ? (
          responsibilities.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
              <span className="p-1 bg-emerald-50 text-emerald-600 rounded shrink-0 mt-0.5">
                <CheckSquare className="w-3.5 h-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))
        ) : (
          <p className="text-xs text-slate-400">No responsibilities extracted.</p>
        )}
      </ul>
    </Card>
  );
}
