import { z } from "zod";

export const createJobSchema = z.object({
  job_title: z.string().min(2, "Job title must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z
    .string()
    .min(50, "Job description must be at least 50 characters to provide sufficient context for AI analysis"),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
