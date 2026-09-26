import { apiRequest } from "@/lib/api";

export type ReadingProgress = {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  progress: number;
  lastReadAt: string;
};

export async function updateReadingProgress(
  novelId: string,
  chapterId: string,
  progress: number,
) {
  return apiRequest<ReadingProgress>(
    `/reading-progress/novels/${novelId}/progress`,
    {
      method: "POST",
      body: JSON.stringify({
        chapterId,
        progress,
      }),
    },
  );
}

export async function getReadingProgress(novelId: string) {
  return apiRequest<ReadingProgress | null>(
    `/reading-progress/novels/${novelId}/progress`,
  );
}