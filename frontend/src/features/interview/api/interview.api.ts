import api from "@/lib/axios";
import type {
  InterviewStartRequest,
  InterviewStartResponse,
  AnswerSubmitRequest,
  AnswerSubmitResponse,
  InterviewSession,
  InterviewSessionDetail,
} from "../types/interview.types";

export const startInterviewApi = async (
  data: InterviewStartRequest
): Promise<InterviewStartResponse> => {
  const response = await api.post<InterviewStartResponse>(
    "/interviews/start",
    data
  );
  return response.data;
};

export const submitAnswerApi = async (
  sessionId: string,
  data: AnswerSubmitRequest
): Promise<AnswerSubmitResponse> => {
  const response = await api.post<AnswerSubmitResponse>(
    `/interviews/${sessionId}/answer`,
    data
  );
  return response.data;
};

export const finishInterviewApi = async (
  sessionId: string
): Promise<InterviewSession> => {
  const response = await api.post<InterviewSession>(
    `/interviews/${sessionId}/finish`
  );
  return response.data;
};

export const getInterviewApi = async (
  sessionId: string
): Promise<InterviewSessionDetail> => {
  const response = await api.get<InterviewSessionDetail>(
    `/interviews/${sessionId}`
  );
  return response.data;
};

export const getInterviewsApi = async (): Promise<InterviewSession[]> => {
  const response = await api.get<InterviewSession[]>("/interviews");
  return response.data;
};

export const deleteInterviewApi = async (sessionId: string): Promise<void> => {
  await api.delete(`/interviews/${sessionId}`);
};
