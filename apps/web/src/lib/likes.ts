import { apiRequest } from "@/lib/api";

export type LikeCountResponse = {
  count: number;
};

export type LikeStatusResponse = {
  liked: boolean;
};

export async function getNovelLikes(novelId: string) {
  return apiRequest<LikeCountResponse>(`/novels/${novelId}/likes`);
}

export async function getLikeStatus(novelId: string) {
  return apiRequest<LikeStatusResponse>(`/novels/${novelId}/like-status`);
}

export async function likeNovel(novelId: string) {
  return apiRequest(`/novels/${novelId}/like`, {
    method: "POST",
  });
}

export async function unlikeNovel(novelId: string) {
  return apiRequest(`/novels/${novelId}/like`, {
    method: "DELETE",
  });
}
