import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

type PublishedChapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function usePublishChapter(
  novelId: string,
  chapterId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest<PublishedChapter>(
        `/chapters/${chapterId}/publish`,
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

      toast.success("Chapter published successfully", {
        description: `"${chapter.title}" is now available to readers.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to publish chapter", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}