export interface JobAnalysis {
  id: string;
  job_description_id: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
  responsibilities: string[];
  keywords: string[];
  summary: string;
  created_at: string;
}

export interface JobDescription {
  id: string;
  user_id?: string;
  job_title: string;
  company_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  analysis?: JobAnalysis | null;
}

export interface CreateJobRequest {
  job_title: string;
  company_name: string;
  description: string;
}
