import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummaryApi,
  getSkillBreakdownApi,
  getProgressTimelineApi,
} from "../api/dashboard.api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummaryApi,
  });
};

export const useSkillBreakdown = () => {
  return useQuery({
    queryKey: ["dashboard", "skills"],
    queryFn: getSkillBreakdownApi,
  });
};

export const useProgressTimeline = () => {
  return useQuery({
    queryKey: ["dashboard", "progress"],
    queryFn: getProgressTimelineApi,
  });
};
