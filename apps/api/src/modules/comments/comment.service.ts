import { prisma } from "../../lib/prisma.js";

export async function getChapterComments(chapterId: string) {
  return prisma.comment.findMany({
    where: {
      chapterId,
      parentId: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
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
      replies: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
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

type CreateCommentInput = {
  userId: string;
  chapterId: string;
  content: string;
  parentId?: string;
};

export async function createComment({
  userId,
  chapterId,
  content,
  parentId,
}: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      userId,
      chapterId,
      content,
      ...(parentId ? { parentId } : {}),
    },
    include: {
      user: {
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
  });
}

export async function getCommentById(commentId: string) {
  return prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
}

export async function deleteComment(commentId: string) {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}

export async function createReply({
  userId,
  commentId,
  content,
}: {
  userId: string;
  commentId: string;
  content: string;
}) {
  const parentComment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!parentComment) {
    throw new Error("Comment not found");
  }

  return prisma.comment.create({
    data: {
      userId,
      chapterId: parentComment.chapterId,
      content,
      parentId: commentId,
    },
    include: {
      user: {
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
  });
}