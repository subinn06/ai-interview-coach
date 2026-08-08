import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, ShieldAlert } from "lucide-react";
import { passwordSchema, type PasswordFormData } from "../schemas/profile.schema";
import { useChangePassword } from "../hooks/useProfile";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SecuritySettings() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully.");
          reset();
        },
        onError: (err: any) => {
          const message = err.response?.data?.detail || "Failed to change password.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-purple-600" />
          Security & Credentials
        </h3>
        <p className="text-xs text-slate-500">
          Update your account password to ensure your profile remains secure.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input
          type="password"
          label="Current Password"
          placeholder="••••••••"
          error={errors.current_password?.message}
          {...register("current_password")}
        />

        <Input
          type="password"
          label="New Password"
          placeholder="••••••••"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <Input
          type="password"
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button
          type="submit"
          size="sm"
          isLoading={changePasswordMutation.isPending}
          className="flex items-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          Update Password
        </Button>
      </form>
    </Card>
  );
}
