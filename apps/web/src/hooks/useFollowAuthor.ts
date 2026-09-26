"use client";

import { apiRequest } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type FollowStatus = {
  isFollowing: boolean;
  isSelf: boolean;
};

export function useFollowAuthor(username: string, isAuthenticated: boolean) {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["author-follow-status", username],
    queryFn: () =>
      apiRequest<FollowStatus>(`/authors/${username}/follow-status`),
    enabled: Boolean(username) && isAuthenticated,
  });

  const followMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/authors/${username}/follow`, {
        method: "POST",
      }),

    onSuccess: () => {
      queryClient.setQueryData<FollowStatus>(
        ["author-follow-status", username],
        {
          isFollowing: true,
          isSelf: false,
        },
      );

      toast.success("Author followed");
    },

    onError: (error) => {
      toast.error("Failed to follow author", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/authors/${username}/follow`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      queryClient.setQueryData<FollowStatus>(
        ["author-follow-status", username],
        {
          isFollowing: false,
          isSelf: false,
        },
      );

      toast.success("Author unfollowed");
    },

    onError: (error) => {
      toast.error("Failed to unfollow author", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    },
  });

  return {
    isFollowing: statusQuery.data?.isFollowing ?? false,
    isSelf: statusQuery.data?.isSelf ?? false,

    isLoadingStatus: statusQuery.isLoading,

    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,

    isFollowingLoading: followMutation.isPending,
    isUnfollowingLoading: unfollowMutation.isPending,
  };
}
