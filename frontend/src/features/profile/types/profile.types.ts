export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdatePayload {
  full_name: string;
}

export interface PasswordChangePayload {
  current_password: string;
  new_password: string;
}

export interface InterviewPreferencesPayload {
  default_difficulty: "easy" | "medium" | "hard";
  default_question_count: number;
  interview_style: "technical" | "behavioral" | "mixed";
}
