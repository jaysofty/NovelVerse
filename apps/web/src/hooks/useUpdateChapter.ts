import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

export type UpdateChapterInput = {
  title: string;
  chapterNumber: number;
  content: string;
};

export type UpdatedChapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useUpdateChapter(
  novelId: string,
  chapterId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: UpdateChapterInput,
    ) => {
      return apiRequest<UpdatedChapter>(
        `/chapters/${chapterId}`,
        {
          method: "PATCH",
          body: JSON.stringify(input),
        },
      );
    },

    onSuccess: (chapter) => {
      // Refresh the individual chapter data.
      queryClient.invalidateQueries({
        queryKey: ["author-chapter", chapterId],
      });

      // Refresh the author's novel data, including its chapter list.
      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      // Refresh the chapter list if you have a dedicated query for it.
      queryClient.invalidateQueries({
        queryKey: ["novel-chapters", novelId],
      });

      toast.success("Chapter updated successfully", {
        description: `"${chapter.title}" has been saved.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to update chapter", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}