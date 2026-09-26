import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api";

export type AuthorChapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  novel: {
    id: string;
    title: string;
    slug: string;
  };
};

export function useAuthorChapter(chapterId: string) {
  return useQuery({
    queryKey: ["author-chapter", chapterId],

    queryFn: async () => {
      return apiRequest<AuthorChapter>(
        `/authors/me/chapters/${chapterId}`,
      );
    },

    enabled: Boolean(chapterId),
  });
}