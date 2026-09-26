import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

type UnpublishedChapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useUnpublishChapter(
  novelId: string,
  chapterId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest<UnpublishedChapter>(
        `/chapters/${chapterId}/unpublish`,
        {
          method: "PATCH",
        },
      );
    },

    onSuccess: (chapter) => {
      queryClient.invalidateQueries({
        queryKey: ["author-chapter", chapterId],
      });

      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      queryClient.invalidateQueries({
        queryKey: ["novel-chapters", novelId],
      });

      toast.success("Chapter moved to drafts", {
        description: `"${chapter.title}" is no longer public.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to unpublish chapter", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}