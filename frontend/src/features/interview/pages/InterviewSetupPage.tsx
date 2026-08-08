import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Play, Sparkles, FileText, Briefcase, Zap } from "lucide-react";
import { useResumes } from "@/features/resume/hooks/useResume";
import type { Resume } from "@/features/resume/types/resume.types";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import type { JobDescription } from "@/features/jobs/types/jobs.types";
import { useStartInterview } from "../hooks/useInterview";
import { startInterviewSchema, type StartInterviewFormData } from "../schemas/interview.schema";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";

export default function InterviewSetupPage() {
  const navigate = useNavigate();

  const { data: resumes, isLoading: loadingResumes } = useResumes();
  const { data: jobs, isLoading: loadingJobs } = useJobs();
  const startMutation = useStartInterview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StartInterviewFormData>({
    resolver: zodResolver(startInterviewSchema),
    defaultValues: {
      difficulty: "medium",
    },
  });

  const selectedDifficulty = watch("difficulty");

  if (loadingResumes || loadingJobs) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const hasResumes = resumes && resumes.length > 0;
  const hasJobs = jobs && jobs.length > 0;

  if (!hasResumes || !hasJobs) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Setup AI Interview</h1>
        <EmptyState
          icon={Sparkles}
          title="Resume and Job Target Required"
          description="To generate personalized interview questions, please upload at least one Resume and add at least one Job Target Posting first."
          actionLabel={!hasResumes ? "Upload Resume First" : "Add Job Target Posting First"}
          onAction={() => navigate(!hasResumes ? "/resumes" : "/jobs")}
        />
      </div>
    );
  }

  const onSubmit = (data: StartInterviewFormData) => {
    toast.info("Generating personalized interview questions via Gemini AI...");
    startMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success("Interview session initialized!");
        navigate(`/interview/${res.session_id}`, {
          state: { firstQuestion: res.first_question },
        });
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.detail || "Failed to initialize interview session.";
        toast.error(message);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          Configure AI Interview Session
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select your active resume and target role to launch a tailored technical interview simulator.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* resume selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              1. Select Resume
            </label>
            <select
              {...register("resume_id")}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            >
              <option value="">-- Select uploaded resume --</option>
              {resumes.map((r: Resume) => (
                <option key={r.id} value={r.id}>
                  {r.filename} {r.created_at ? `(Uploaded ${new Date(r.created_at).toLocaleDateString()})` : ""}
                </option>
              ))}
            </select>
            {errors.resume_id && (
              <p className="text-xs font-medium text-red-500">
                {errors.resume_id.message}
              </p>
            )}
          </div>

          {/* job target selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              2. Select Target Job Posting
            </label>
            <select
              {...register("job_description_id")}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            >
              <option value="">-- Select target job posting --</option>
              {jobs.map((j: JobDescription) => (
                <option key={j.id} value={j.id}>
                  {j.job_title} at {j.company_name}
                </option>
              ))}
            </select>
            {errors.job_description_id && (
              <p className="text-xs font-medium text-red-500">
                {errors.job_description_id.message}
              </p>
            )}
          </div>

          {/* difficulty selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              3. Choose Interview Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "hard"] as const).map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setValue("difficulty", diff)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
            {errors.difficulty && (
              <p className="text-xs font-medium text-red-500">
                {errors.difficulty.message}
              </p>
            )}
          </div>

          {/* start submit button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              isLoading={startMutation.isPending}
              size="md"
              className="flex items-center gap-2 px-8"
            >
              <Play className="w-4 h-4 fill-current" />
              Start AI Mock Interview
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
