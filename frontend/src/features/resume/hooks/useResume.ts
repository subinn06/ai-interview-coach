import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResumesApi,
  getResumeApi,
  uploadResumeApi,
  analyzeResumeApi,
  deleteResumeApi,
} from "../api/resume.api";

export const useResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumesApi,
  });
};

export const useResume = (id?: string) => {
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: () => getResumeApi(id!),
    enabled: Boolean(id),
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (pct: number) => void;
    }) => uploadResumeApi(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useAnalyzeResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyzeResumeApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResumeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
