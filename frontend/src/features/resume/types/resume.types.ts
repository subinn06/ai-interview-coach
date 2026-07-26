export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  ats_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  summary: string;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  stored_filename: string;
  file_path: string;
  extracted_text?: string;
  analyses?: ResumeAnalysis[];
  created_at?: string;
}
