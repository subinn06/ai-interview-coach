export interface DashboardSummary {
  total_interviews: number;
  average_score: number;
  best_score: number;
  latest_score: number;
}

export interface SkillBreakdown {
  technical: number;
  communication: number;
  problem_solving: number;
  confidence: number;
}

export interface ProgressItem {
  date: string;
  score: number;
}
