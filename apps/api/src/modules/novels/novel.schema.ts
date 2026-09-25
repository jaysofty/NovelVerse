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

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .default("PRIVATE"),

  contentType: z
    .enum(["TEXT"])
    .default("TEXT"),

  creationType: z
    .enum(["ORIGINAL"])
    .default("ORIGINAL"),
});

export type CreateNovelInput = z.infer<
  typeof createNovelSchema
>;
export const updateNovelSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 200 characters")
    .nullable()
    .optional(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .optional(),

  coverUrl: z
    .string()
    .trim()
    .url("Cover image must be a valid URL")
    .nullable()
    .optional(),
});

export type UpdateNovelInput = z.infer<typeof updateNovelSchema>;