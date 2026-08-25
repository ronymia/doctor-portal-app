import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export type TLoginSchema = z.infer<typeof loginSchema>;
