import { apiRequest } from "@/lib/api";

export type Bookmark = {
  id: string;
  userId: string;
  novelId: string;
  createdAt: string;
  novel: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    coverUrl: string | null;
    status: string;
    visibility: string;
    author: {
      id: string;
      profile: {
        username: string;
        displayName: string | null;
        avatarUrl: string | null;
      } | null;
    };
  };
};

export async function getUserBookmarks() {
  return apiRequest<Bookmark[]>("/bookmarks");
}

export async function createBookmark(novelId: string) {
  return apiRequest<Bookmark>(
    `/novels/${novelId}/bookmark`,
    {
      method: "POST",
    },
  );
}

export async function deleteBookmark(novelId: string) {
  return apiRequest<void>(
    `/novels/${novelId}/bookmark`,
    {
      method: "DELETE",
    },
  );
}