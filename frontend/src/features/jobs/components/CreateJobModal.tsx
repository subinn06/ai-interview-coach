import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Briefcase } from "lucide-react";
import { createJobSchema, type CreateJobFormData } from "../schemas/jobs.schema";
import { useCreateJob } from "../hooks/useJobs";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const createMutation = useCreateJob();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateJobFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success(`Target job "${data.job_title}" created!`);
        reset();
        onClose();
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.detail || "Failed to create job posting.";
        toast.error(message);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* modal card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Add Target Job Description
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Job Title"
            placeholder="e.g. Senior Fullstack Engineer"
            error={errors.job_title?.message}
            {...register("job_title")}
          />

          <Input
            label="Company Name"
            placeholder="e.g. Google / Stripe"
            error={errors.company_name?.message}
            {...register("company_name")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">
              Job Description Details
            </label>
            <textarea
              rows={6}
              placeholder="Paste full job posting requirements, responsibilities, and technical skills..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none font-sans"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-xs font-medium text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending} size="sm">
              Save Job Target
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
