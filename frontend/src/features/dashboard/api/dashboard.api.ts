import api from "@/lib/axios";
import type {
  DashboardSummary,
  SkillBreakdown,
  ProgressItem,
} from "../types/dashboard.types";

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};

export const getSkillBreakdownApi = async (): Promise<SkillBreakdown> => {
  const response = await api.get<SkillBreakdown>("/dashboard/skills");
  return response.data;
};

export const getProgressTimelineApi = async (): Promise<ProgressItem[]> => {
  const response = await api.get<ProgressItem[]>("/dashboard/progress");
  return response.data;
};
