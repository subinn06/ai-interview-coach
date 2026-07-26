import api from "@/lib/axios";
import type {
  JobDescription,
  JobAnalysis,
  CreateJobRequest,
} from "../types/jobs.types";

export const createJobApi = async (data: CreateJobRequest): Promise<JobDescription> => {
  const response = await api.post<JobDescription>("/jobs/", data);
  return response.data;
};

export const getJobsApi = async (): Promise<JobDescription[]> => {
  const response = await api.get<JobDescription[]>("/jobs/");
  return response.data;
};

export const getJobApi = async (id: string): Promise<JobDescription> => {
  const response = await api.get<JobDescription>(`/jobs/${id}`);
  return response.data;
};

export const analyzeJobApi = async (id: string): Promise<JobAnalysis> => {
  const response = await api.post<JobAnalysis>(`/jobs/${id}/analyze`);
  return response.data;
};

export const deleteJobApi = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};
