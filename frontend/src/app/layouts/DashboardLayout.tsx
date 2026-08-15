import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import MobileDrawer from "@/components/common/MobileDrawer";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { accessToken, isAuthenticated } = useAuthStore();

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* desktop sidebar (hidden on mobile) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* mobile drawer (visible when toggled on mobile) */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
