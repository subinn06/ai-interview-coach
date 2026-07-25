import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { UploadCloud, Briefcase, PlayCircle, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Upload Resume",
      description: "Analyze PDF resume & check ATS score",
      icon: UploadCloud,
      path: "/resumes",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      title: "Analyze Job Target",
      description: "Extract required skills from job post",
      icon: Briefcase,
      path: "/jobs",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      title: "Start AI Interview",
      description: "Simulate tailored 5-question interview",
      icon: PlayCircle,
      path: "/interview",
      color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              onClick={() => navigate(action.path)}
              className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl transition-colors ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
