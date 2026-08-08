import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function TimerCounter() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs font-semibold rounded-lg border border-slate-200">
      <Clock className="w-3.5 h-3.5 text-slate-500" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
}
