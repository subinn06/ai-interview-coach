import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ResumeListPage from "@/features/resume/pages/ResumeListPage";
import ResumeDetailPage from "@/features/resume/pages/ResumeDetailPage";
import JobListPage from "@/features/jobs/pages/JobListPage";
import JobDetailPage from "@/features/jobs/pages/JobDetailPage";
import InterviewSetupPage from "@/features/interview/pages/InterviewSetupPage";
import InterviewSessionPage from "@/features/interview/pages/InterviewSessionPage";
import InterviewReportPage from "@/features/interview/pages/InterviewReportPage";
import InterviewHistoryPage from "@/features/interview/pages/InterviewHistoryPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import ReportPage from "@/features/reports/pages/ReportPage";

// inline placeholder page components for other features
const LandingPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-8">
    <h1 className="text-4xl font-extrabold text-blue-600 mb-4 animate-pulse">AI Interview Coach</h1>
    <p className="text-lg text-slate-600 mb-6 font-medium">Frontend Foundation Ready</p>
    <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all">
      Go to Login
    </a>
  </div>
);

const ProfilePlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Candidate Profile & Settings</h2>
    <p className="text-slate-500 font-medium">Customize mock difficulty configurations and credentials.</p>
  </div>
);

export const router = createBrowserRouter([
  // public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPlaceholder />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
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
        element: <DashboardPage />
      },
      {
        path: "resumes",
        element: <ResumeListPage />
      },
      {
        path: "resumes/:id",
        element: <ResumeDetailPage />
      },
      {
        path: "jobs",
        element: <JobListPage />
      },
      {
        path: "jobs/:id",
        element: <JobDetailPage />
      },
      {
        path: "interview",
        element: <Navigate to="/interview/setup" replace />
      },
      {
        path: "interview/setup",
        element: <InterviewSetupPage />
      },
      {
        path: "interview/:sessionId",
        element: <InterviewSessionPage />
      },
      {
        path: "interview/report/:sessionId",
        element: <InterviewReportPage />
      },
      {
        path: "interviews",
        element: <InterviewHistoryPage />
      },
      {
        path: "reports",
        element: <ReportsPage />
      },
      {
        path: "reports/:id",
        element: <ReportPage />
      },
      {
        path: "profile",
        element: <ProfilePlaceholder />
      }
    ]
  },
  // fallback routes
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
