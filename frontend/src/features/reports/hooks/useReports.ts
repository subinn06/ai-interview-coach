import { useQuery } from "@tanstack/react-query";
import {
  getReportApi,
  getReportBySessionApi,
  getReportsApi,
  getDashboardSummaryApi,
  getSkillAnalyticsApi,
  getProgressAnalyticsApi,
} from "../api/reports.api";

export const useReport = (id?: string) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => getReportApi(id!),
    enabled: Boolean(id),
  });
};

export const useReportBySession = (sessionId?: string) => {
  return useQuery({
    queryKey: ["reports", "session", sessionId],
    queryFn: () => getReportBySessionApi(sessionId!),
    enabled: Boolean(sessionId),
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReportsApi,
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummaryApi,
  });
};

export const useSkillAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "skills"],
    queryFn: getSkillAnalyticsApi,
  });
};

export const useProgressAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "progress"],
    queryFn: getProgressAnalyticsApi,
  });
};
