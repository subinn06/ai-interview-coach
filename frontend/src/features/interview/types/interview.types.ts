export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  order_number: number;
}

export interface InterviewStartRequest {
  resume_id: string;
  job_description_id: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface InterviewStartResponse {
  session_id: string;
  first_question: InterviewQuestion;
}

export interface AnswerSubmitRequest {
  question_id: string;
  answer: string;
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export interface AnswerSubmitResponse {
  evaluation: AnswerEvaluation;
  next_question?: InterviewQuestion | null;
}

export interface InterviewAnswer {
  id: string;
  answer: string;
  score: number;
  feedback: string;
  answered_at: string;
}

export interface InterviewQuestionDetail {
  id: string;
  question: string;
  category: string;
  order_number: number;
  expected_topics: string[];
  created_at: string;
  answer?: InterviewAnswer | null;
}

export interface InterviewSession {
  id: string;
  status: "started" | "completed" | "cancelled";
  difficulty: string;
  total_score?: number | null;
  started_at: string;
  completed_at?: string | null;
}

export interface InterviewSessionDetail extends InterviewSession {
  questions: InterviewQuestionDetail[];
}
