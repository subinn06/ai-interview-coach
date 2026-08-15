import { memo } from "react";
import Card from "@/components/ui/Card";
import { HelpCircle, Tag, Layers } from "lucide-react";

interface QuestionCardProps {
  questionText: string;
  category: string;
  difficulty: string;
  currentNumber: number;
  totalQuestions?: number;
}

const QuestionCard = memo(function QuestionCard({
  questionText,
  category,
  difficulty,
  currentNumber,
  totalQuestions = 5,
}: QuestionCardProps) {
  const diffColors: Record<string, string> = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const currentDiffColor =
    diffColors[difficulty.toLowerCase()] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <Card className="p-6 space-y-4 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          Question {currentNumber} of {totalQuestions}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {category}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${currentDiffColor}`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 leading-snug">
          {questionText}
        </h2>
      </div>
    </Card>
  );
});

export default QuestionCard;
