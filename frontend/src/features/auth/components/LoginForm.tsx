import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { getCurrentUserApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { getErrorMessage } from "@/lib/error-handler";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      { username: data.email, password: data.password },
      {
        onSuccess: async (res) => {
          loginSuccess(res.access_token);
          try {
            const userProfile = await getCurrentUserApi();
            loginSuccess(res.access_token, userProfile);
          } catch {
            // intentionally empty
          }
          toast.success("Logged in successfully!");
          if (onSuccess) onSuccess();
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err));
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Input
        label="Email Address"
        type="email"
        placeholder="candidate@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 flex items-center justify-center gap-2"
        isLoading={loginMutation.isPending}
        loadingText="Signing in..."
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    </form>
  );
}
