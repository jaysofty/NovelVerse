import { apiRequest } from "@/lib/api";

export type AuthorNovel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  publishedAt: string | null;
  _count: {
    chapters: number;
    likes: number;
  };
};

export type AuthorDashboard = {
  id: string;

  profile: {
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };

  novels: AuthorNovel[];

  stats: {
    novelCount: number;
    publishedCount: number;
    draftCount: number;
    totalLikes: number;
  };
};

export async function getMyAuthorProfile() {
  return apiRequest<AuthorDashboard>("/authors/me");
}

