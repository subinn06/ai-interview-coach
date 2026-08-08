import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name cannot exceed 100 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirm_password: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
