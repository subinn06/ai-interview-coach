import { z } from "zod";

export const startInterviewSchema = z.object({
  resume_id: z.string().min(1, "Please select a resume"),
  job_description_id: z.string().min(1, "Please select a target job posting"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type StartInterviewFormData = z.infer<typeof startInterviewSchema>;
