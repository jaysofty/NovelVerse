import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),

  role: z.enum(["USER", "AUTHOR"]).default("USER"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;