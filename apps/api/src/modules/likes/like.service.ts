import { prisma } from "../../lib/prisma.js";

export async function likeNovel(userId: string, novelId: string) {
  return prisma.like.create({
    data: {
      userId,
      novelId,
    },
  });
}

export async function unlikeNovel(userId: string, novelId: string) {
  return prisma.like.delete({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
  });
}

export async function getNovelLikes(novelId: string) {
  return prisma.like.count({
    where: {
      novelId,
    },
  });
}

export async function hasUserLikedNovel(
  userId: string,
  novelId: string,
) {
  const like = await prisma.like.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
  });

  return Boolean(like);
}