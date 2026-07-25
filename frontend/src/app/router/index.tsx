import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

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

const DashboardPlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Dashboard</h2>
    <p className="text-slate-500">Candidate analytics metrics and mock summaries will be rendered here.</p>
  </div>
);

const ResumesPlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Resume Manager</h2>
    <p className="text-slate-500">PDF resume parser and AI ATS analysis checks will live here.</p>
  </div>
);

const JobsPlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Job Target Listings</h2>
    <p className="text-slate-500">Insert custom target requirements and compare keyword mismatches.</p>
  </div>
);

const InterviewPlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Interview Session Simulator</h2>
    <p className="text-slate-500">AI audio/text dynamic interview chat loop will run here.</p>
  </div>
);

const ReportsPlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">AI Coaching Feedback Reports</h2>
    <p className="text-slate-500">Structured evaluation card highlighting topic gaps and strengths.</p>
  </div>
);

const ProfilePlaceholder = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2 text-slate-800">Candidate Profile & Settings</h2>
    <p className="text-slate-500">Customize mock difficulty configurations and credentials.</p>
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
        element: <DashboardPlaceholder />
      },
      {
        path: "resumes",
        element: <ResumesPlaceholder />
      },
      {
        path: "jobs",
        element: <JobsPlaceholder />
      },
      {
        path: "interview",
        element: <InterviewPlaceholder />
      },
      {
        path: "reports",
        element: <ReportsPlaceholder />
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
