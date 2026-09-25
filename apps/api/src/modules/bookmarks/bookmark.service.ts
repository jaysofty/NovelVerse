import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.ts";

export async function createBookmark(
  userId: string,
  novelId: string,
) {
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

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
  });

  if (existingBookmark) {
    throw new Error("Novel already bookmarked");
  }

  return prisma.bookmark.create({
    data: {
      userId,
      novelId,
    },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
      },
    },
  });
}

export async function deleteBookmark(
  userId: string,
  novelId: string,
) {
  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
  });

  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  await prisma.bookmark.delete({
    where: {
      id: bookmark.id,
    },
  });
}

export async function getUserBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverUrl: true,
          status: true,
          visibility: true,
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
}