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
    .max(2000, "Description must be at most 2000 characters")
    .optional(),

  visibility: z.enum(["PRIVATE", "PUBLIC"]),
});

export type CreateNovelFormValues = z.infer<
  typeof createNovelSchema
>;