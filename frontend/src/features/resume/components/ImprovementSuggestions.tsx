import Card from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

interface ImprovementSuggestionsProps {
  summary: string;
}

export default function ImprovementSuggestions({
  summary,
}: ImprovementSuggestionsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        AI Improvement Suggestions
      </h3>
      <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
          {summary || "No AI feedback summary generated yet. Click Analyze Resume to trigger Gemini."}
        </p>
      </div>
    </Card>
  );
}
