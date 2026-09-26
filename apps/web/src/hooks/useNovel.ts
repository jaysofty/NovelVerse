"use client";

import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api";

export type AuthorNovel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  visibility: "PRIVATE" | "PUBLIC";
  contentType: "TEXT";
  creationType: "ORIGINAL";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  author: {
    id: string;
    profile: {
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  };

  genres: {
    id: string;
    name: string;
  }[];

  chapters: {
    id: string;
    title: string;
    chapterNumber: number;
    publishedAt: string | null;
    createdAt: string;
  }[];

  _count: {
    likes: number;
    bookmarks: number;
    chapters: number;
  };
};

export function useNovel(id: string) {
  return useQuery({
    queryKey: ["author-novel", id],

    queryFn: async () => {
      return apiRequest<AuthorNovel>(
        `/authors/me/novels/${id}`,
      );
    },

    enabled: Boolean(id),
  });
}
