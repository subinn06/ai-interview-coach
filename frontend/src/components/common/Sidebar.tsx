import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface SidebarProps {
  onItemClick?: () => void;
}

export const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Manager", path: "/resumes", icon: FileText },
  { label: "Job Descriptions", path: "/jobs", icon: Briefcase },
  { label: "Interview", path: "/interview", icon: MessageSquare },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Profile", path: "/profile", icon: User },
];

export default function Sidebar({ onItemClick }: SidebarProps) {
  const { handleLogout } = useLogout();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 h-full">
      {/* brand logo header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          AI Interview Coach
        </span>
      </div>

      {/* navigation items list */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* footer logout button */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <button
          onClick={() => {
            if (onItemClick) onItemClick();
            handleLogout();
          }}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 mr-3 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
