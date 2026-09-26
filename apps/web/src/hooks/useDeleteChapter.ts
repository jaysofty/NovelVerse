import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

export function useDeleteChapter(
  novelId: string,
  chapterId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest<void>(`/chapters/${chapterId}`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      queryClient.invalidateQueries({
        queryKey: ["author-chapter", chapterId],
      });

      queryClient.invalidateQueries({
        queryKey: ["novel-chapters", novelId],
      });

      toast.success("Chapter deleted successfully", {
        description: "The chapter has been permanently removed.",
      });
    },

    onError: (error) => {
      toast.error("Failed to delete chapter", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}