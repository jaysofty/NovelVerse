"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

export type CreateChapterInput = {
  title: string;
  chapterNumber: number;
  content: string;
};

export type CreatedChapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useCreateChapter(novelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: CreateChapterInput,
    ) => {
      return apiRequest<CreatedChapter>(
        `/chapters/novel/${novelId}`,
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
    },

    onSuccess: (chapter) => {
      /*
       * Invalidate the novel details query so that
       * the new chapter appears immediately.
       */
      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      toast.success("Chapter created successfully", {
        description: `"${chapter.title}" has been saved as a draft.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to create chapter", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}