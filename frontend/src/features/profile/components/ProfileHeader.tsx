import Card from "@/components/ui/Card";
import { ShieldCheck, Mail } from "lucide-react";
import type { UserProfile } from "../types/profile.types";

interface ProfileHeaderProps {
  user: UserProfile | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.full_name);

  return (
    <Card className="p-6 md:p-8 bg-slate-900 text-white shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
        {/* avatar circle */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl font-black text-white shadow-lg border-2 border-white/20 shrink-0">
          {initials}
        </div>

        {/* user info */}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">
              {user?.full_name || "Candidate"}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider w-fit mx-auto sm:mx-0">
              <ShieldCheck className="w-3 h-3" />
              Verified Account
            </span>
          </div>

          <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            {user?.email || "candidate@example.com"}
          </p>
        </div>
      </div>
    </Card>
  );
}
