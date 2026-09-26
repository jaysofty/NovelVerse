"use client";

import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UnpublishedNovel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  visibility: "PRIVATE" | "PUBLIC";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useUnpublishNovel(novelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest<UnpublishedNovel>(
        `/authors/me/novels/${novelId}/unpublish`,
        {
          method: "PATCH",
        },
      ),

    onSuccess: (novel) => {
      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      queryClient.invalidateQueries({
        queryKey: ["author-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["novels"],
      });

      toast.success("Novel unpublished", {
        description: `"${novel.title}" has been removed from Discover.`,
      });
    },

    onError: (error) => {
      console.error("UNPUBLISH NOVEL ERROR:", error);

      toast.error("Failed to unpublish novel", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}