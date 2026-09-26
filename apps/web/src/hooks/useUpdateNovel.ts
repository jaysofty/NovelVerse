import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

export type UpdateNovelInput = {
  title: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
  coverUrl?: string | null;
};

export type UpdatedNovel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  visibility: "PUBLIC" | "PRIVATE";
  contentType: "TEXT";
  creationType: "ORIGINAL";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useUpdateNovel(novelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateNovelInput) => {
      return apiRequest<UpdatedNovel>(
        `/authors/me/novels/${novelId}`,
        {
          method: "PATCH",
          body: JSON.stringify(input),
        },
      );
    },

    onSuccess: (novel) => {
      // Refresh the novel detail page
      queryClient.invalidateQueries({
        queryKey: ["author-novel", novelId],
      });

      toast.success("Novel updated successfully", {
        description: `"${novel.title}" has been saved.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to update novel", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}