import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.ts";

type CreateMediaInput = {
  novelId: string;
  type: "PDF" | "VIDEO" | "AUDIO" | "IMAGE";
  url: string;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
};

export async function createMedia({
  novelId,
  type,
  url,
  mimeType,
  fileName,
  fileSize,
  duration,
}: CreateMediaInput) {
  const novel = await prisma.novel.findUnique({
    where: {
      id: novelId,
    },
  });

if (!novel) {
  throw new AppError(
    "Novel not found or you are not the author",
    404,
    "NOVEL_NOT_FOUND",
  );
}

  // Prevent duplicate media for the same novel
  const existing = await prisma.mediaAsset.findFirst({
    where: {
      novelId,
      url,
    },
  });

  if (existing) {
    throw new Error("Media already exists for this novel");
  }

  return prisma.mediaAsset.create({
    data: {
      novelId,
      type,
      url,
      mimeType: mimeType ?? null,
      fileName: fileName ?? null,
      fileSize: fileSize ?? null,
      duration: duration ?? null,
    },
  });
}

export async function getNovelMedia(novelId: string) {
  return prisma.mediaAsset.findMany({
    where: {
      novelId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMediaById(mediaId: string) {
  return prisma.mediaAsset.findUnique({
    where: {
      id: mediaId,
    },
  });
}

export async function deleteMedia(
  mediaId: string,
  userId: string,
) {
  const media = await prisma.mediaAsset.findUnique({
    where: {
      id: mediaId,
    },
    include: {
      novel: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  if (media.novel.authorId !== userId) {
    throw new Error("You are not authorized to delete this media");
  }

  return prisma.mediaAsset.delete({
    where: {
      id: mediaId,
    },
  });
}