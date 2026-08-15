import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthStore } from "@/store/auth-store";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// route level code splitting via react.lazy
// each page is loaded on demand, reducing initial bundle size
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const ResumeListPage = lazy(() => import("@/features/resume/pages/ResumeListPage"));
const ResumeDetailPage = lazy(() => import("@/features/resume/pages/ResumeDetailPage"));
const JobListPage = lazy(() => import("@/features/jobs/pages/JobListPage"));
const JobDetailPage = lazy(() => import("@/features/jobs/pages/JobDetailPage"));
const InterviewSetupPage = lazy(() => import("@/features/interview/pages/InterviewSetupPage"));
const InterviewSessionPage = lazy(() => import("@/features/interview/pages/InterviewSessionPage"));
const InterviewReportPage = lazy(() => import("@/features/interview/pages/InterviewReportPage"));
const InterviewHistoryPage = lazy(() => import("@/features/interview/pages/InterviewHistoryPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const ReportPage = lazy(() => import("@/features/reports/pages/ReportPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/features/profile/pages/SettingsPage"));

// lightweight suspense fallback - renders instantly while chunks load
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-400">Loading…</span>
      </div>
    </div>
  );
}

// helper to wrap lazy components in suspense
function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// automatic root redirect - goes to /dashboard if logged in, otherwise /login
const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export const router = createBrowserRouter([
  // public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      {
        path: "login",
        element: withSuspense(LoginPage)
      },
      {
        path: "register",
        element: withSuspense(RegisterPage)
      }
    ]
  },
  // dashboard routes
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: withSuspense(DashboardPage)
      },
      {
        path: "resumes",
        element: withSuspense(ResumeListPage)
      },
      {
        path: "resumes/:id",
        element: withSuspense(ResumeDetailPage)
      },
      {
        path: "jobs",
        element: withSuspense(JobListPage)
      },
      {
        path: "jobs/:id",
        element: withSuspense(JobDetailPage)
      },
      {
        path: "interview",
        element: <Navigate to="/interview/setup" replace />
      },
      {
        path: "interview/setup",
        element: withSuspense(InterviewSetupPage)
      },
      {
        path: "interview/:sessionId",
        element: withSuspense(InterviewSessionPage)
      },
      {
        path: "interview/report/:sessionId",
        element: withSuspense(InterviewReportPage)
      },
      {
        path: "interviews",
        element: withSuspense(InterviewHistoryPage)
      },
      {
        path: "reports",
        element: withSuspense(ReportsPage)
      },
      {
        path: "reports/:id",
        element: withSuspense(ReportPage)
      },
      {
        path: "profile",
        element: withSuspense(ProfilePage)
      },
      {
        path: "settings",
        element: withSuspense(SettingsPage)
      }
    ]
  },
  // fallback routes
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

