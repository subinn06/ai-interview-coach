import { Link, useNavigate, Navigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start sharpening your technical interview skills with AI
          </p>
        </div>

        <RegisterForm onSuccess={() => navigate("/login")} />

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
