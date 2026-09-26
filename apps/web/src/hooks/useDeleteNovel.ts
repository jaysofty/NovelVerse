"use client";

import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeletedNovel = {
  id: string;
  title: string;
};

export function useDeleteNovel(novelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest<DeletedNovel>(
        `/authors/me/novels/${novelId}`,
        {
          method: "DELETE",
        },
      );
    },

    onSuccess: (deletedNovel) => {
      console.log("DELETE SUCCESS:", deletedNovel);

      queryClient.removeQueries({
        queryKey: ["author-novel", novelId],
      });

      queryClient.invalidateQueries({
        queryKey: ["author-novels"],
      });

      toast.success("Novel deleted", {
        description: `"${deletedNovel.title}" has been permanently deleted.`,
      });
    },

    onError: (error) => {
      console.error("DELETE NOVEL ERROR:", error);

      toast.error("Failed to delete novel", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    },
  });
}