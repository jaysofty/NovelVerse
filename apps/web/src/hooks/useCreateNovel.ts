import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";

export type CreateNovelInput = {
  title: string;
  description?: string;
  visibility: "PRIVATE" | "PUBLIC";
  contentType: "TEXT";
  creationType: "ORIGINAL";
};

export type CreatedNovel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  visibility: "PRIVATE" | "PUBLIC";
  contentType: "TEXT";
  creationType: "ORIGINAL";
  createdAt: string;
  updatedAt: string;
};

export function useCreateNovel() {
  return useMutation({
    mutationFn: async (
      input: CreateNovelInput,
    ) => {
      return apiRequest<CreatedNovel>(
        "/novels",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
    },

    onSuccess: (novel) => {
      toast.success("Novel created successfully", {
        description: `"${novel.title}" has been saved as a draft.`,
      });
    },

    onError: (error) => {
      toast.error("Failed to create novel", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}