import { apiRequest } from "@/lib/api";

export async function getTrendingNovels() {
  return apiRequest("/novels");
}

export async function getGenres() {
  return apiRequest("/genres");
}