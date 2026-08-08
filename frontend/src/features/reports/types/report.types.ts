export interface RecommendedTopic {
  topic: string;
  reason?: string;
  priority?: "high" | "medium" | "low" | string;
}

export interface FeedbackReport {
  id: string;
  session_id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  confidence_score: number;
  summary: string;
  strengths: string[];
  improvement_areas: string[];
  recommended_topics: (string | RecommendedTopic)[];
  created_at?: string | null;
}

export interface DashboardSummary {
  total_interviews: number;
  average_score: number;
  best_score: number;
  latest_score: number;
}

export interface SkillAnalytics {
  technical: number;
  communication: number;
  problem_solving: number;
  confidence: number;
}

export interface ProgressPoint {
  date: string;
  score: number;
}
