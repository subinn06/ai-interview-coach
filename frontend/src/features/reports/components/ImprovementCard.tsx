import Card from "@/components/ui/Card";
import { AlertCircle, Lightbulb } from "lucide-react";

interface ImprovementCardProps {
  improvements: string[];
}

export default function ImprovementCard({ improvements }: ImprovementCardProps) {
  return (
    <Card className="p-6 space-y-4 border-amber-100 bg-amber-50/20">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        Key Areas to Improve
      </h3>

      <ul className="space-y-2.5">
        {improvements && improvements.length > 0 ? (
          improvements.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <p className="text-xs text-slate-400">No improvement areas recorded.</p>
        )}
      </ul>
    </Card>
  );
}
