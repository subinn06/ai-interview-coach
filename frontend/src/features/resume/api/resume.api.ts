import api from "@/lib/axios";
import type { Resume, ResumeAnalysis } from "../types/resume.types";

export const uploadResumeApi = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<Resume> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Resume>("/resumes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
      }
    },
  });
  return response.data;
};

export const getResumesApi = async (): Promise<Resume[]> => {
  const response = await api.get<Resume[]>("/resumes/");
  return response.data;
};

export const getResumeApi = async (id: string): Promise<Resume> => {
  const response = await api.get<Resume>(`/resumes/${id}`);
  return response.data;
};

export const analyzeResumeApi = async (id: string): Promise<ResumeAnalysis> => {
  const response = await api.post<ResumeAnalysis>(`/resumes/${id}/analyze`);
  return response.data;
};

export const deleteResumeApi = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};
