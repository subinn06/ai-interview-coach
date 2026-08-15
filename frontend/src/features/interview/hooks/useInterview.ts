import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startInterviewApi,
  submitAnswerApi,
  finishInterviewApi,
  getInterviewApi,
  getInterviewsApi,
  deleteInterviewApi,
} from "../api/interview.api";
import type {
  InterviewStartRequest,
  AnswerSubmitRequest,
} from "../types/interview.types";

export const useInterviews = () => {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: getInterviewsApi,
    staleTime: 5 * 60 * 1000, // 5 minutes - list changes on start/finish/delete
    gcTime: 15 * 60 * 1000,   // 15 minutes
    retry: 1,
  });
};

export const useInterview = (sessionId?: string) => {
  return useQuery({
    queryKey: ["interviews", sessionId],
    queryFn: () => getInterviewApi(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 30 * 1000,      // 30 seconds - active session needs freshness
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 2,                  // retry more for active sessions
  });
};

export const useStartInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InterviewStartRequest) => startInterviewApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useSubmitAnswer = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AnswerSubmitRequest) => submitAnswerApi(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", sessionId] });
    },
  });
};

export const useFinishInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => finishInterviewApi(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => deleteInterviewApi(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
