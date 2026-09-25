import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.ts";

import type { CreateNovelInput, UpdateNovelInput } from "./novel.schema.js";

type GetNovelsInput = {
  page: number;
  limit: number;
  search?: string;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
};

export async function createNovel(authorId: string, input: CreateNovelInput) {
  const slug = await generateUniqueSlug(input.title);
  const novel = await prisma.novel.create({
    data: {
      title: input.title,
      slug,
      description: input.description ?? null,
      authorId,
      status: "DRAFT",
      visibility: input.visibility,
      contentType: input.contentType,
      creationType: input.creationType,
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
  return novel;
}

export async function updateNovel(
  novelId: string,
  authorId: string,
  input: UpdateNovelInput,
) {
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

  return prisma.novel.update({
    where: {
      id: novelId,
    },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),

      ...(input.description !== undefined
        ? { description: input.description }
        : {}),

      ...(input.visibility !== undefined
        ? { visibility: input.visibility }
        : {}),

      ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
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
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
async function generateUniqueSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.novel.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function getNovels({
  page = 1,
  limit = 10,
  search,
  status = "PUBLISHED",
}: GetNovelsInput) {
  const skip = (page - 1) * limit;

  const where = {
    status,
    visibility: "PUBLIC" as const,
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [novels, total] = await Promise.all([
    prisma.novel.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
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
        _count: {
          select: {
            chapters: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    }),

    prisma.novel.count({
      where,
    }),
  ]);

  return {
    novels,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNovelBySlug(slug: string) {
  const novel = await prisma.novel.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },

    include: {
      author: {
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
        },
      },

      genres: {
        include: {
          genre: true,
        },
      },

      chapters: {
        where: {
          publishedAt: {
            not: null,
          },
        },

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
    },
  });

  if (!novel) {
    return null;
  }

  return {
    id: novel.id,
    title: novel.title,
    slug: novel.slug,
    description: novel.description,
    coverUrl: novel.coverUrl,
    status: novel.status,
    visibility: novel.visibility,
    publishedAt: novel.publishedAt,

    author: {
      id: novel.author.id,
      profile: novel.author.profile,
    },

    genres: novel.genres.map((item) => item.genre),

    chapters: novel.chapters,
  };
}

export async function getNovelById(novelId: string) {
  return prisma.novel.findUnique({
    where: {
      id: novelId,
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


export async function deleteNovel(
  novelId: string,
  authorId: string,
) {
  const novel = await prisma.novel.findFirst({
    where: {
      id: novelId,
      authorId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!novel) {
    throw new AppError(
      "Novel not found or you are not the author",
      404,
      "NOVEL_NOT_FOUND",
    );
  }

  await prisma.novel.delete({
    where: {
      id: novelId,
    },
  });

  return {
    id: novel.id,
    title: novel.title,
  };
}