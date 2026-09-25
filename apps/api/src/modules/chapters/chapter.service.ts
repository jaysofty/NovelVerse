import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.ts";
type CreateChapterInput = {
  novelId: string;
  authorId: string;
  title: string;
  chapterNumber: number;
  content: string;
};

type UpdateChapterInput = {
  chapterId: string;
  authorId: string;
  title?: string;
  chapterNumber?: number;
  content?: string;
  publishedAt?: Date | null;
};

export async function getNovelChapters(novelId: string) {
  return prisma.chapter.findMany({
    where: {
      novelId,
    },
    select: {
      id: true,
      title: true,
      chapterNumber: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      chapterNumber: "asc",
    },
  });
}

export async function createChapter({
  novelId,
  authorId,
  title,
  chapterNumber,
  content,
}: CreateChapterInput) {
  const novel = await prisma.novel.findFirst({
    where: {
      id: novelId,
      authorId,
    },
  });

  if (!novel) {
    throw new AppError(
      "Novel not found or you are not the author",
      404,
      "NOVEL_NOT_FOUND",
    );
  }

  return prisma.chapter.create({
    data: {
      novelId,
      title,
      chapterNumber,
      content,
    },
  });
}

export async function updateChapter({
  chapterId,
  authorId,
  title,
  chapterNumber,
  content,
  publishedAt,
}: UpdateChapterInput) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      novel: {
        authorId,
      },
    },
  });

  if (!chapter) {
    throw new AppError(
      "Chapter not found or you are not the author",
      404,
      "CHAPTER_NOT_FOUND",
    );
  }

  if (chapterNumber !== undefined && chapterNumber !== chapter.chapterNumber) {
    const existingChapter = await prisma.chapter.findFirst({
      where: {
        novelId: chapter.novelId,
        chapterNumber,
        NOT: {
          id: chapterId,
        },
      },
    });

    if (existingChapter) {
      throw new AppError(
        "Chapter number already exists for this novel",
        409,
        "CHAPTER_NUMBER_EXISTS",
      );
    }
  }

  return prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data: {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(chapterNumber !== undefined ? { chapterNumber } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(publishedAt !== undefined ? { publishedAt } : {}),
    },
  });
}

export async function deleteChapter(chapterId: string, authorId: string) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      novel: {
        authorId,
      },
    },
  });

 if (!chapter) {
  throw new AppError(
    "Chapter not found or you are not the author",
    404,
    "CHAPTER_NOT_FOUND",
  );
}

  await prisma.chapter.delete({
    where: {
      id: chapterId,
    },
  });
}

export async function getChapterById(chapterId: string) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      publishedAt: {
        not: null,
      },
      novel: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
    },

    select: {
      id: true,
      title: true,
      chapterNumber: true,
      content: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,

      novel: {
        select: {
          id: true,
          title: true,
          slug: true,

          author: {
            select: {
              profile: {
                select: {
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!chapter) {
    return null;
  }

  const [previousChapter, nextChapter] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        novelId: chapter.novel.id,
        publishedAt: {
          not: null,
        },
        chapterNumber: {
          lt: chapter.chapterNumber,
        },
      },
      select: {
        id: true,
        title: true,
        chapterNumber: true,
      },
      orderBy: {
        chapterNumber: "desc",
      },
    }),

    prisma.chapter.findFirst({
      where: {
        novelId: chapter.novel.id,
        publishedAt: {
          not: null,
        },
        chapterNumber: {
          gt: chapter.chapterNumber,
        },
      },
      select: {
        id: true,
        title: true,
        chapterNumber: true,
      },
      orderBy: {
        chapterNumber: "asc",
      },
    }),
  ]);

  return {
    ...chapter,
    previousChapter,
    nextChapter,
  };
}

export async function getAuthorChapterById(
  chapterId: string,
  authorId: string,
) {
  return prisma.chapter.findFirst({
    where: {
      id: chapterId,
      novel: {
        authorId,
      },
    },
    select: {
      id: true,
      title: true,
      chapterNumber: true,
      content: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,

      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          visibility: true,
        },
      },
    },
  });
}