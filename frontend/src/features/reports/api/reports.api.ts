import api from "@/lib/axios";
import type {
  FeedbackReport,
  DashboardSummary,
  SkillAnalytics,
  ProgressPoint,
} from "../types/report.types";

export const getReportApi = async (id: string): Promise<FeedbackReport> => {
  const response = await api.get<FeedbackReport>(`/reports/${id}`);
  return response.data;
};

export const getReportBySessionApi = async (
  sessionId: string
): Promise<FeedbackReport> => {
  const response = await api.get<FeedbackReport>(
    `/reports/session/${sessionId}`
  );
  return response.data;
};

export const getReportsApi = async (): Promise<FeedbackReport[]> => {
  const response = await api.get<FeedbackReport[]>("/reports");
  return response.data;
};

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};

export const getSkillAnalyticsApi = async (): Promise<SkillAnalytics> => {
  const response = await api.get<SkillAnalytics>("/dashboard/skills");
  return response.data;
};

export const getProgressAnalyticsApi = async (): Promise<ProgressPoint[]> => {
  const response = await api.get<ProgressPoint[]>("/dashboard/progress");
  return response.data;
};
