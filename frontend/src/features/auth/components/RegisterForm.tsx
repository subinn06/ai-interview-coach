import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useRegister";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully! Please sign in.");
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.detail || "Registration failed. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Input
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        error={errors.full_name?.message}
        {...register("full_name")}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="jane@example.com"
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
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Input
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full mt-2 flex items-center justify-center gap-2"
        isLoading={registerMutation.isPending}
      >
        <UserPlus className="w-4 h-4" />
        Create Account
      </Button>
    </form>
  );
}
