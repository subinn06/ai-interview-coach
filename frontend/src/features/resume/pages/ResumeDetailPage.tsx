import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useResume, useAnalyzeResume } from "../hooks/useResume";
import ATSScoreCard from "../components/ATSScoreCard";
import SkillsSection from "../components/SkillsSection";
import ImprovementSuggestions from "../components/ImprovementSuggestions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";

import { getErrorMessage } from "@/lib/error-handler";

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRawText, setShowRawText] = useState(false);

  const { data: resume, isLoading, isError } = useResume(id);
  const analyzeMutation = useAnalyzeResume();

  const latestAnalysis =
    resume?.analyses && resume.analyses.length > 0
      ? resume.analyses[resume.analyses.length - 1]
      : null;

  const handleAnalyze = () => {
    if (!id) return;
    toast.info("Triggering Gemini AI ATS Analysis...");
    analyzeMutation.mutate(id, {
      onSuccess: (analysis) => {
        toast.success(`Analysis complete! ATS Score: ${analysis.ats_score}%`);
      },
      onError: (err: unknown) => {
        toast.error(getErrorMessage(err));
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

  if (isError || !resume) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/resumes")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resumes
        </Button>
        <EmptyState
          icon={FileText}
          title="Resume Not Found"
          description="The requested resume could not be loaded or does not exist."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/resumes")}
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Resume List
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            {resume.filename}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Uploaded on {resume.created_at ? new Date(resume.created_at).toLocaleString() : "Recently"}
          </p>
        </div>

        <Button
          onClick={handleAnalyze}
          isLoading={analyzeMutation.isPending}
          loadingText="Analyzing with AI..."
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          {latestAnalysis ? "Re-run Analysis" : "Analyze with Gemini AI"}
        </Button>
      </div>

      {/* main analysis display */}
      {latestAnalysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left column - ats score card & suggestions */}
          <div className="lg:col-span-1 space-y-6">
            <ATSScoreCard score={latestAnalysis.ats_score} />
            <ImprovementSuggestions summary={latestAnalysis.summary} />
          </div>

          {/* right column - extracted skills & raw text */}
          <div className="lg:col-span-2 space-y-6">
            <SkillsSection
              strengths={latestAnalysis.strengths || []}
              weaknesses={latestAnalysis.weaknesses || []}
              missingSkills={latestAnalysis.missing_skills || []}
            />

            {/* extracted pdf text collapsible view */}
            {resume.extracted_text && (
              <Card className="p-6">
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="w-full flex items-center justify-between font-bold text-slate-800 text-sm cursor-pointer"
                >
                  <span>Parsed Resume Text ({resume.extracted_text.length} characters)</span>
                  {showRawText ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showRawText && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-96 overflow-y-auto font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-hidden">
                    {resume.extracted_text}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No AI Analysis Generated Yet"
          description="Click 'Analyze with Gemini AI' above to calculate ATS score, extract skills, and receive recommendations."
          actionLabel="Run First Analysis"
          onAction={handleAnalyze}
        />
      )}
    </div>
  );
}
