import { z } from "zod";

export const createNovelSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters")
    .optional(),

  coverUrl: z
    .string()
    .trim()
    .url("Cover URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .default("PRIVATE"),

  contentType: z
    .enum(["TEXT", "PDF", "VIDEO", "AUDIO"])
    .default("TEXT"),

  creationType: z
    .enum(["ORIGINAL", "AI_GENERATED", "AI_ASSISTED"])
    .default("ORIGINAL"),
});

export type CreateNovelInput = z.infer<typeof createNovelSchema>;