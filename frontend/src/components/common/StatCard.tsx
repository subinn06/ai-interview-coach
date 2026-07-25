import { type LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  subtitle?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  iconColor = "text-blue-600 bg-blue-50",
}: StatCardProps) {
  return (
    <Card className="flex items-center justify-between p-6">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
            {trend}
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-2xl ${iconColor}`}>
        <Icon className="w-6 h-6 shrink-0" />
      </div>
    </Card>
  );
}
