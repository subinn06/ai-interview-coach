import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { LayoutDashboard, FileText, Briefcase, MessageSquare, BarChart3, User, LogOut } from "lucide-react";

export default function DashboardLayout() {
  const { accessToken, clear } = useAuthStore();
  const location = useLocation();

  // redirecting unauthorized users
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Resumes", path: "/resumes", icon: FileText },
    { label: "Jobs", path: "/jobs", icon: Briefcase },
    { label: "Interview", path: "/interview", icon: MessageSquare },
    { label: "Reports", path: "/reports", icon: BarChart3 },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* sidebar navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Interview Coach
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={clear}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* dashboard content viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
          <div className="text-slate-500 text-sm font-medium">
            Welcome back! Ready for your next mock session?
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
