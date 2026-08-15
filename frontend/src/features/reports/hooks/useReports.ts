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
    staleTime: 30 * 60 * 1000, // 30 minutes - reports are immutable once generated
    gcTime: 60 * 60 * 1000,    // 1 hour
    retry: 1,
  });
};

export const useReportBySession = (sessionId?: string) => {
  return useQuery({
    queryKey: ["reports", "session", sessionId],
    queryFn: () => getReportBySessionApi(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReportsApi,
    staleTime: 5 * 60 * 1000,  // 5 minutes - list changes when new reports are generated
    gcTime: 20 * 60 * 1000,
    retry: 1,
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummaryApi,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

export const useSkillAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "skills"],
    queryFn: getSkillAnalyticsApi,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

export const useProgressAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "progress"],
    queryFn: getProgressAnalyticsApi,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};
