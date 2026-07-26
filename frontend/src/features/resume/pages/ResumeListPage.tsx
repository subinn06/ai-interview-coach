import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Award,
} from "lucide-react";
import {
  useResumes,
  useAnalyzeResume,
  useDeleteResume,
} from "../hooks/useResume";
import ResumeUploader from "../components/ResumeUploader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/Skeleton";

export default function ResumeListPage() {
  const [showUploader, setShowUploader] = useState(false);
  const navigate = useNavigate();

  const { data: resumes, isLoading, isError } = useResumes();
  const analyzeMutation = useAnalyzeResume();
  const deleteMutation = useDeleteResume();

  const handleAnalyze = (id: string, name: string) => {
    toast.info(`Analyzing "${name}" with Gemini AI...`);
    analyzeMutation.mutate(id, {
      onSuccess: (analysis) => {
        toast.success(`Analysis complete! ATS Score: ${analysis.ats_score}%`);
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.detail || "Failed to analyze resume.";
        toast.error(message);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`"${name}" deleted.`);
        },
        onError: (err: any) => {
          const message = err.response?.data?.detail || "Failed to delete resume.";
          toast.error(message);
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Resume Manager
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload PDF resumes and evaluate AI ATS match compatibility.
          </p>
        </div>
        <Button
          onClick={() => setShowUploader(!showUploader)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showUploader ? "Close Uploader" : "Upload Resume"}
        </Button>
      </div>

      {/* collapsible uploader */}
      {showUploader && (
        <ResumeUploader onSuccess={() => setShowUploader(false)} />
      )}

      {/* resume cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <EmptyState
          icon={FileText}
          title="Error Loading Resumes"
          description="Failed to fetch resumes. Please ensure backend server is active."
        />
      ) : !resumes || resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Resumes Uploaded Yet"
          description="Upload your first PDF resume to run Gemini ATS checks and skill extraction."
          actionLabel="Upload First Resume"
          onAction={() => setShowUploader(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => {
            const latestAnalysis =
              resume.analyses && resume.analyses.length > 0
                ? resume.analyses[resume.analyses.length - 1]
                : null;

            return (
              <Card
                key={resume.id}
                className="flex flex-col justify-between p-6 hover:shadow-lg transition-all"
              >
                <div>
                  {/* file header badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    {latestAnalysis ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                        <Award className="w-3.5 h-3.5" />
                        ATS {latestAnalysis.ats_score}%
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                        Not Analyzed
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate" title={resume.filename}>
                    {resume.filename}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "Recently"}
                  </p>
                </div>

                {/* actions footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    onClick={() => handleAnalyze(resume.id, resume.filename)}
                    size="sm"
                    variant="secondary"
                    className="flex-1 text-xs"
                    isLoading={analyzeMutation.isPending && analyzeMutation.variables === resume.id}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Analyze
                  </Button>

                  <Button
                    onClick={() => navigate(`/resumes/${resume.id}`)}
                    size="sm"
                    variant="secondary"
                    className="px-2.5 text-xs"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                  </Button>

                  <Button
                    onClick={() => handleDelete(resume.id, resume.filename)}
                    size="sm"
                    variant="ghost"
                    className="px-2.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
