import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { UploadCloud, FileText, X } from "lucide-react";
import { useUploadResume } from "../hooks/useResume";
import Button from "@/components/ui/Button";

interface ResumeUploaderProps {
  onSuccess?: () => void;
}

export default function ResumeUploader({ onSuccess }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadResume();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Only PDF files are supported.");
      return false;
    }
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setProgress(0);
    uploadMutation.mutate(
      {
        file: selectedFile,
        onProgress: (pct) => setProgress(pct),
      },
      {
        onSuccess: () => {
          toast.success(`"${selectedFile.name}" uploaded successfully!`);
          setSelectedFile(null);
          setProgress(0);
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.detail || "Failed to upload resume. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-2">Upload New Resume</h3>
      <p className="text-xs text-slate-500 mb-4">
        Upload your PDF resume to extract skills and compute AI ATS scores.
      </p>

      {/* dropzone container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Click to browse or drag & drop PDF
          </p>
          <p className="text-xs text-slate-400 mt-1">PDF format up to 5MB</p>
        </div>
      </div>

      {/* selected file preview */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* progress bar */}
      {uploadMutation.isPending && (
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* submit upload button */}
      {selectedFile && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpload}
            isLoading={uploadMutation.isPending}
            size="sm"
          >
            Upload Resume
          </Button>
        </div>
      )}
    </div>
  );
}
