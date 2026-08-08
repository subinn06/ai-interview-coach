import { useState } from "react";
import { toast } from "sonner";
import { Sliders, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function InterviewPreferences() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    () => (localStorage.getItem("pref_difficulty") as any) || "medium"
  );
  const [questionCount, setQuestionCount] = useState<number>(
    () => Number(localStorage.getItem("pref_question_count")) || 5
  );
  const [style, setStyle] = useState<"technical" | "behavioral" | "mixed">(
    () => (localStorage.getItem("pref_style") as any) || "technical"
  );

  const handleSave = () => {
    localStorage.setItem("pref_difficulty", difficulty);
    localStorage.setItem("pref_question_count", String(questionCount));
    localStorage.setItem("pref_style", style);
    toast.success("Interview preferences saved.");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          AI Mock Interview Preferences
        </h3>
        <p className="text-xs text-slate-500">
          Configure default settings for quick-starting mock interview sessions.
        </p>
      </div>

      <div className="space-y-4 max-w-lg">
        {/* difficulty */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Default Question Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-2 px-3 text-xs font-bold rounded-lg border capitalize transition-all cursor-pointer ${
                  difficulty === level
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* question count */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Questions per Mock Session
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={3}>3 Questions (Quick Sprint)</option>
            <option value={5}>5 Questions (Standard Mock)</option>
            <option value={10}>10 Questions (Deep Technical Evaluation)</option>
          </select>
        </div>

        {/* interview style */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Preferred Interview Focus
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["technical", "behavioral", "mixed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`py-2 px-3 text-xs font-bold rounded-lg border capitalize transition-all cursor-pointer ${
                  style === s
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </Button>
      </div>
    </Card>
  );
}
