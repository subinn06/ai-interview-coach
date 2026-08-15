import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummaryApi,
  getSkillBreakdownApi,
  getProgressTimelineApi,
} from "../api/dashboard.api";

// dashboard analytics change only when an interview is completed,
// so they can tolerate a longer stale period than active resources

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummaryApi,
    staleTime: 10 * 60 * 1000, // 10 minutes - rarely changes mid session
    gcTime: 30 * 60 * 1000,    // 30 minutes - keep in cache longer
    retry: 1,
  });
};

export const useSkillBreakdown = () => {
  return useQuery({
    queryKey: ["dashboard", "skills"],
    queryFn: getSkillBreakdownApi,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

export const useProgressTimeline = () => {
  return useQuery({
    queryKey: ["dashboard", "progress"],
    queryFn: getProgressTimelineApi,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};
