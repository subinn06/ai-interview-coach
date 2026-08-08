import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Save, Lock } from "lucide-react";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/useProfile";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { UserProfile } from "../types/profile.types";

interface ProfileFormProps {
  user: UserProfile | null;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
      },
      onError: (err: any) => {
        const message = err.response?.data?.detail || "Failed to update profile.";
        toast.error(message);
      },
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </h3>
        <p className="text-xs text-slate-500">
          Update your display name across your mock interviews and reports.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input
          label="Full Name"
          placeholder="Subin Suresh"
          error={errors.full_name?.message}
          {...register("full_name")}
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              disabled
              value={user?.email || ""}
              className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono"
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[11px] text-slate-400">
            Email address cannot be changed directly for security reasons.
          </p>
        </div>

        <Button
          type="submit"
          size="sm"
          isLoading={updateMutation.isPending}
          className="flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          Save Profile Changes
        </Button>
      </form>
    </Card>
  );
}
