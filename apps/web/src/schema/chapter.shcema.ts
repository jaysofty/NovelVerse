import { z } from "zod";

export const createChapterSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Chapter title is required")
    .max(200, "Chapter title must be at most 200 characters"),

  chapterNumber: z
    .coerce
    .number()
    .int("Chapter number must be a whole number")
    .min(1, "Chapter number must be at least 1"),

  content: z
    .string()
    .trim()
    .min(1, "Chapter content is required"),
});

export type CreateChapterFormValues = z.infer<
  typeof createChapterSchema
>;