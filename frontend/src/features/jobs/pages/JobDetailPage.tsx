import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Building, ChevronDown, ChevronUp } from "lucide-react";
import { useJob, useAnalyzeJob } from "../hooks/useJobs";
import JobSkillsSection from "../components/JobSkillsSection";
import ResponsibilitiesList from "../components/ResponsibilitiesList";
import SkillGapChart from "../components/SkillGapChart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRawText, setShowRawText] = useState(false);

  const { data: job, isLoading, isError } = useJob(id);
  const analyzeMutation = useAnalyzeJob();

  const analysis = job?.analysis;

  const handleAnalyze = () => {
    if (!id || !job) return;
    toast.info(`Triggering Gemini AI Analysis for "${job.job_title}"...`);
    analyzeMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Analysis complete for "${job.job_title}"!`);
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.detail || "Failed to run job analysis.";
        toast.error(message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/jobs")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job List
        </Button>
        <EmptyState
          icon={Building}
          title="Job Description Not Found"
          description="The requested job target could not be loaded or does not exist."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Job Target List
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-purple-600" />
            {job.job_title}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {job.company_name} • Posted target
          </p>
        </div>

        <Button
          onClick={handleAnalyze}
          isLoading={analyzeMutation.isPending}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          {analysis ? "Re-run Analysis" : "Analyze with Gemini AI"}
        </Button>
      </div>

      {/* main analysis display */}
      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left column - skill gap & required skills */}
          <div className="lg:col-span-1 space-y-6">
            <SkillGapChart requiredSkills={analysis.required_skills || []} />
            <JobSkillsSection
              requiredSkills={analysis.required_skills || []}
              preferredSkills={analysis.preferred_skills || []}
              keywords={analysis.keywords || []}
            />
          </div>

          {/* right column - responsibilities list & description text */}
          <div className="lg:col-span-2 space-y-6">
            <ResponsibilitiesList
              responsibilities={analysis.responsibilities || []}
              experienceLevel={analysis.experience_level}
              summary={analysis.summary}
            />

            {/* raw job description collapsible text */}
            <Card className="p-6">
              <button
                onClick={() => setShowRawText(!showRawText)}
                className="w-full flex items-center justify-between font-bold text-slate-800 text-sm cursor-pointer"
              >
                <span>Full Job Posting Text ({job.description.length} characters)</span>
                {showRawText ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showRawText && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-96 overflow-y-auto font-sans text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No AI Analysis Generated Yet"
          description="Click 'Analyze with Gemini AI' above to extract required skills, responsibilities, and experience levels."
          actionLabel="Run First Job Analysis"
          onAction={handleAnalyze}
        />
      )}
    </div>
  );
}
