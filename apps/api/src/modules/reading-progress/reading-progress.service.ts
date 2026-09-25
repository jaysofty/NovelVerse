import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.ts";

type UpdateReadingProgressInput = {
  userId: string;
  novelId: string;
  chapterId: string;
  progress: number;
};

export async function updateReadingProgress({
  userId,
  novelId,
  chapterId,
  progress,
}: UpdateReadingProgressInput) {
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

  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      novelId,
    },
  });

  if (!chapter) {
    throw new AppError(
      "Chapter not found for this novel",
      404,
      "CHAPTER_NOT_FOUND",
    );
  }

  if (progress < 0 || progress > 1) {
    throw new AppError(
      "Progress must be between 0 and 1",
      400,
      "INVALID_PROGRESS",
    );
  }

  return prisma.readingProgress.upsert({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },

    update: {
      chapterId,
      progress,
      lastReadAt: new Date(),
    },

    create: {
      userId,
      novelId,
      chapterId,
      progress,
      lastReadAt: new Date(),
    },

    include: {
      chapter: {
        select: {
          id: true,
          title: true,
          chapterNumber: true,
        },
      },

      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}

export async function getReadingProgress(userId: string, novelId: string) {
  return prisma.readingProgress.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
    include: {
      chapter: {
        select: {
          id: true,
          title: true,
          chapterNumber: true,
        },
      },
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}
