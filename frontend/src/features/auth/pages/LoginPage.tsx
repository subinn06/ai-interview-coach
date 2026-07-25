import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to continue your AI Interview practice
          </p>
        </div>

        <LoginForm onSuccess={() => navigate("/dashboard")} />

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
}
