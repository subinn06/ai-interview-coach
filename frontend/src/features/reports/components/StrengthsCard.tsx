import Card from "@/components/ui/Card";
import { CheckCircle2, ThumbsUp } from "lucide-react";

interface StrengthsCardProps {
  strengths: string[];
}

export default function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card className="p-6 space-y-4 border-emerald-100 bg-emerald-50/20">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <ThumbsUp className="w-5 h-5 text-emerald-600" />
        Demonstrated Strengths
      </h3>

      <ul className="space-y-2.5">
        {strengths && strengths.length > 0 ? (
          strengths.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <p className="text-xs text-slate-400">No specific strengths recorded.</p>
        )}
      </ul>
    </Card>
  );
}
