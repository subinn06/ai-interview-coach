import Card from "@/components/ui/Card";
import { BookOpen, Tag } from "lucide-react";

interface RecommendedTopicsProps {
  topics: (string | { topic: string; reason?: string; priority?: string })[];
}

export default function RecommendedTopics({ topics }: RecommendedTopicsProps) {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        Recommended Study Topics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics && topics.length > 0 ? (
          topics.map((t, idx) => {
            const isObj = typeof t === "object" && t !== null;
            const title = isObj ? t.topic : String(t);
            const reason = isObj ? t.reason : null;
            const priority = isObj ? t.priority : null;

            return (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    {title}
                  </span>
                  {priority && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 uppercase">
                      {priority}
                    </span>
                  )}
                </div>
                {reason && (
                  <p className="text-[11px] text-slate-500 leading-snug">{reason}</p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400">No study topics suggested.</p>
        )}
      </div>
    </Card>
  );
}
