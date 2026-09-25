import { prisma } from "../../lib/prisma.js";
import type { CreateNovelInput } from "./author.schema.ts";

export async function getAuthorByUsername(username: string) {
  const author = await prisma.user.findFirst({
    where: {
      role: "AUTHOR",
      profile: {
        username,
      },
    },

    select: {
      id: true,

      profile: {
        select: {
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
        },
      },

      novels: {
        where: {
          status: "PUBLISHED",
          visibility: "PUBLIC",
        },

        orderBy: {
          publishedAt: "desc",
        },

        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverUrl: true,
          status: true,
          publishedAt: true,

          _count: {
            select: {
              chapters: true,
              likes: true,
            },
          },
        },
      },
    },
  });

  if (!author) {
    return null;
  }

  const [novelCount, followerCount] = await Promise.all([
    prisma.novel.count({
      where: {
        authorId: author.id,
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
    }),

    prisma.follow.count({
      where: {
        followingId: author.id,
      },
    }),
  ]);

  return {
    ...author,
    novelCount,
    followerCount,
  };
}

export async function getMyAuthorProfile(userId: string) {
  const author = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "AUTHOR",
    },

    select: {
      id: true,

      profile: {
        select: {
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
        },
      },

      novels: {
        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverUrl: true,
          status: true,
          visibility: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              chapters: true,
              likes: true,
              bookmarks: true,
            },
          },
        },
      },
    },
  });

  if (!author) {
    return null;
  }

  const [novelCount, publishedCount, draftCount, totalLikes] =
    await Promise.all([
      prisma.novel.count({
        where: {
          authorId: userId,
        },
      }),

      prisma.novel.count({
        where: {
          authorId: userId,
          status: "PUBLISHED",
        },
      }),

      prisma.novel.count({
        where: {
          authorId: userId,
          status: "DRAFT",
        },
      }),

      prisma.like.count({
        where: {
          novel: {
            authorId: userId,
          },
        },
      }),
    ]);

  return {
    ...author,

    stats: {
      novelCount,
      publishedCount,
      draftCount,
      totalLikes,
    },
  };
}

export async function createNovel(authorId: string, input: CreateNovelInput) {
  const slug = input.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const existingSlug = await prisma.novel.findUnique({
    where: {
      slug,
    },
  });

  if (existingSlug) {
    throw new Error("NOVEL_SLUG_ALREADY_EXISTS");
  }

  return prisma.novel.create({
    data: {
      authorId,
      title: input.title,
      slug,
      description: input.description || null,
      coverUrl: input.coverUrl || null,
      visibility: input.visibility,
      contentType: input.contentType,
      creationType: input.creationType,

      status: "DRAFT",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverUrl: true,
      status: true,
      visibility: true,
      contentType: true,
      creationType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAuthorNovelById(authorId: string, novelId: string) {
  return prisma.novel.findFirst({
    where: {
      id: novelId,
      authorId,
    },

    include: {
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

      genres: {
        include: {
          genre: true,
        },
      },

      chapters: {
        select: {
          id: true,
          title: true,
          chapterNumber: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: {
          chapterNumber: "asc",
        },
      },

      _count: {
        select: {
          likes: true,
          bookmarks: true,
          chapters: true,
        },
      },
    },
  });
}

export async function publishAuthorNovel(authorId: string, novelId: string) {
  const novel = await prisma.novel.findFirst({
    where: {
      id: novelId,
      authorId,
    },
  });

  if (!novel) {
    throw new Error("NOVEL_NOT_FOUND");
  }

  if (novel.status === "PUBLISHED") {
    throw new Error("NOVEL_ALREADY_PUBLISHED");
  }

  const publishedNovel = await prisma.novel.update({
    where: {
      id: novelId,
    },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverUrl: true,
      status: true,
      visibility: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return publishedNovel;
}

export async function unpublishAuthorNovel(authorId: string, novelId: string) {
  const novel = await prisma.novel.findFirst({
    where: {
      id: novelId,
      authorId,
    },
  });

  if (!novel) {
    throw new Error("NOVEL_NOT_FOUND");
  }

  if (novel.status !== "PUBLISHED") {
    throw new Error("NOVEL_NOT_PUBLISHED");
  }

  const unpublishedNovel = await prisma.novel.update({
    where: {
      id: novelId,
    },
    data: {
      status: "DRAFT",
      publishedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverUrl: true,
      status: true,
      visibility: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return unpublishedNovel;
}

export async function followAuthor(followerId: string, username: string) {
  const author = await prisma.user.findFirst({
    where: {
      role: "AUTHOR",
      profile: {
        username,
      },
    },
    select: {
      id: true,
      profile: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!author) {
    throw new Error("AUTHOR_NOT_FOUND");
  }

  if (author.id === followerId) {
    throw new Error("CANNOT_FOLLOW_SELF");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: author.id,
      },
    },
  });

  if (existingFollow) {
    throw new Error("ALREADY_FOLLOWING");
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId: author.id,
    },
    select: {
      id: true,
      createdAt: true,
      following: {
        select: {
          id: true,
          profile: {
            select: {
              username: true,
              displayName: true,
            },
          },
        },
      },
    },
  });

  return follow;
}

export async function unfollowAuthor(followerId: string, username: string) {
  const author = await prisma.user.findFirst({
    where: {
      role: "AUTHOR",
      profile: {
        username,
      },
    },
    select: {
      id: true,
    },
  });

  if (!author) {
    throw new Error("AUTHOR_NOT_FOUND");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: author.id,
      },
    },
  });

  if (!existingFollow) {
    throw new Error("NOT_FOLLOWING");
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId: author.id,
      },
    },
  });

  return {
    success: true,
  };
}

export async function getAuthorFollowStatus(
  followerId: string,
  username: string,
) {
  const author = await prisma.user.findFirst({
    where: {
      role: "AUTHOR",
      profile: {
        username,
      },
    },
    select: {
      id: true,
    },
  });

  if (!author) {
    throw new Error("AUTHOR_NOT_FOUND");
  }

  if (author.id === followerId) {
    return {
      isFollowing: false,
      isSelf: true,
    };
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: author.id,
      },
    },
    select: {
      id: true,
    },
  });

  return {
    isFollowing: Boolean(follow),
    isSelf: false,
  };
}
