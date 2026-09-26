"use client";

import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PublishedNovel = {
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

export function usePublishNovel(novelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest<PublishedNovel>(
        `/authors/me/novels/${novelId}/publish`,
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

      toast.success("Novel published", {
        description: `"${novel.title}" is now available on Discover.`,
      });
    },

    onError: (error) => {
      console.error("PUBLISH NOVEL ERROR:", error);

      toast.error("Failed to publish novel", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}