import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobsApi,
  getJobApi,
  createJobApi,
  analyzeJobApi,
  deleteJobApi,
} from "../api/jobs.api";
import type { CreateJobRequest } from "../types/jobs.types";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobsApi,
  });
};

export const useJob = (id?: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJobApi(id!),
    enabled: Boolean(id),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobRequest) => createJobApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useAnalyzeJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyzeJobApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJobApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
