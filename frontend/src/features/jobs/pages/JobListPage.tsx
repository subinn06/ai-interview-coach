import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Search,
  Building,
} from "lucide-react";
import {
  useJobs,
  useAnalyzeJob,
  useDeleteJob,
} from "../hooks/useJobs";
import CreateJobModal from "../components/CreateJobModal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/Skeleton";

import { getErrorMessage } from "@/lib/error-handler";

export default function JobListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: jobs, isLoading, isError } = useJobs();
  const analyzeMutation = useAnalyzeJob();
  const deleteMutation = useDeleteJob();

  const filteredJobs = jobs?.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.job_title.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );
  });

  const handleAnalyze = (id: string, title: string) => {
    toast.info(`Analyzing "${title}" with Gemini AI...`);
    analyzeMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Analysis complete for "${title}"!`);
      },
      onError: (err: unknown) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete target job "${title}"?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`"${title}" deleted.`);
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err));
        },
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Target Descriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add target job postings and run Gemini AI keyword/skill extraction.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Target Job
        </Button>
      </div>

      {/* search filter input */}
      {jobs && jobs.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            aria-label="Search target job descriptions"
            placeholder="Search by job title, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* create job modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* job cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Briefcase}
          title="Error Loading Target Jobs"
          description="Failed to fetch job postings. Please verify backend server."
        />
      ) : !filteredJobs || filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={searchQuery ? "No matching job targets" : "No job descriptions yet."}
          description={
            searchQuery
              ? `No job descriptions matched "${searchQuery}".`
              : "Add a job you're preparing for."
          }
          actionLabel={searchQuery ? undefined : "Add Job"}
          onAction={searchQuery ? undefined : () => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const hasAnalysis = Boolean(job.analysis);

            return (
              <Card
                key={job.id}
                className="flex flex-col justify-between p-6 hover:shadow-lg transition-all"
              >
                <div>
                  {/* company & status header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Building className="w-6 h-6" />
                    </div>
                    {hasAnalysis ? (
                      <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg">
                        {job.analysis?.experience_level || "Analyzed"}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                        Not Analyzed
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate" title={job.job_title}>
                    {job.job_title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {job.company_name}
                  </p>

                  {/* skills chips preview */}
                  {job.analysis?.required_skills && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.analysis.required_skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.analysis.required_skills.length > 3 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                          +{job.analysis.required_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* actions footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    onClick={() => handleAnalyze(job.id, job.job_title)}
                    size="sm"
                    variant="secondary"
                    className="flex-1 text-xs"
                    isLoading={analyzeMutation.isPending && analyzeMutation.variables === job.id}
                    loadingText="Analyzing..."
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Analyze
                  </Button>

                  <Button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    size="sm"
                    variant="secondary"
                    className="px-2.5 text-xs"
                    title="View Details"
                    aria-label={`View details for ${job.job_title}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                  </Button>

                  <Button
                    onClick={() => handleDelete(job.id, job.job_title)}
                    size="sm"
                    variant="ghost"
                    className="px-2.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete Job"
                    aria-label={`Delete job target ${job.job_title}`}
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
