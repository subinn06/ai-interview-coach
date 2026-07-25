import Card from "@/components/ui/Card";
import { CheckCircle, Clock } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "System Architecture Interview",
      status: "Completed",
      score: "85%",
      time: "Yesterday",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: 2,
      title: "Python Senior Backend Target",
      status: "Job Analyzed",
      score: "10 Skills",
      time: "2 days ago",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: 3,
      title: "Senior Fullstack Resume",
      status: "ATS Analyzed",
      score: "88 ATS Score",
      time: "3 days ago",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Recent Activity
        </h3>
        <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
          View All
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${item.color}`}
            >
              {item.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
