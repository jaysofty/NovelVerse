import { prisma } from "../../lib/prisma.js";

export async function getNovelMedia(novelId: string) {
  return prisma.mediaAsset.findMany({
    where: {
      novelId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}