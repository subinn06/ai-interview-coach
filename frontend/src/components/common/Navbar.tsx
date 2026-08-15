import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/resumes":
        return "Resume Manager";
      case "/jobs":
        return "Job Descriptions";
      case "/interview":
        return "AI Interview Session";
      case "/reports":
        return "Coaching Feedback Reports";
      case "/profile":
        return "Candidate Profile";
      case "/settings":
        return "Application Settings";
      default:
        return "AI Interview Coach";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-10">
      {/* left side - hamburger button + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* right side - notifications + user dropdown */}
      <div className="flex items-center gap-4">
        {/* notification bell placeholder */}
        <button
          aria-label="Notifications"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* user profile dropdown */}
        <div className="relative">
          <button
            aria-label="User account menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700">
              {user?.full_name || user?.email || "Candidate"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* dropdown menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.full_name || "Candidate User"}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
