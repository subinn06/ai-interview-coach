import Card from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";
import type { ProgressPoint } from "../types/report.types";

interface PerformanceChartProps {
  data: ProgressPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 text-center space-y-2">
        <TrendingUp className="w-8 h-8 text-slate-300 mx-auto" />
        <h4 className="text-sm font-bold text-slate-800">Your progress will appear here</h4>
        <p className="text-xs text-slate-500">
          Complete your first mock interview session to start tracking performance trends over time.
        </p>
      </Card>
    );
  }

  const height = 140;
  const width = 500;
  const padding = 20;

  const points = data.map((item, index) => {
    const x = padding + (index / (Math.max(data.length - 1, 1))) * (width - 2 * padding);
    const y = height - padding - (item.score / 100) * (height - 2 * padding);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Performance Score Trend
        </h3>
        <span className="text-xs font-bold text-slate-500">
          {data.length} Session{data.length === 1 ? "" : "s"} Tracked
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / 100) * (height - 2 * padding);
            return (
              <line
                key={val}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
            );
          })}

          {areaD && <path d={areaD} fill="url(#scoreGrad)" />}

          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                {p.score}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}
