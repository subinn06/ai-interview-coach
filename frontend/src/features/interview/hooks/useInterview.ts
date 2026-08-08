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
  });
};

export const useInterview = (sessionId?: string) => {
  return useQuery({
    queryKey: ["interviews", sessionId],
    queryFn: () => getInterviewApi(sessionId!),
    enabled: Boolean(sessionId),
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
