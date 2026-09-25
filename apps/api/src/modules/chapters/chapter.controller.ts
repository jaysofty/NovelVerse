import type { Request, Response, NextFunction } from "express";

import {
  getChapterById,
  getNovelChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getAuthorChapterById,
} from "./chapter.service.js";

export async function getChapterByIdController(
  req: Request,
  res: Response,
) {
  try {
    const { chapterId } = req.params;

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await getChapterById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    console.error("Failed to fetch chapter:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chapter",
    });
  }
}

export async function getNovelChaptersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { novelId } = req.params;

    if (typeof novelId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const chapters = await getNovelChapters(novelId);

    return res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuthorChapterByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
        code: "INVALID_CHAPTER_ID",
      });
    }

    const chapter = await getAuthorChapterById(
      chapterId,
      userId,
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found or you are not the author",
        code: "CHAPTER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function createChapterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { novelId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof novelId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const {
      title,
      chapterNumber,
      content,
    } = req.body;

    if (!title || !content || chapterNumber === undefined) {
      return res.status(400).json({
        success: false,
        message: "title, chapterNumber and content are required",
      });
    }

    if (
      !Number.isInteger(Number(chapterNumber)) ||
      Number(chapterNumber) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "chapterNumber must be a positive integer",
      });
    }

    const chapter = await createChapter({
      novelId,
      authorId: userId,
      title,
      chapterNumber: Number(chapterNumber),
      content,
    });

    return res.status(201).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateChapterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const {
      title,
      chapterNumber,
      content,
      publishedAt,
    } = req.body;

    if (
      title === undefined &&
      chapterNumber === undefined &&
      content === undefined &&
      publishedAt === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    let parsedChapterNumber: number | undefined;

    if (chapterNumber !== undefined) {
      parsedChapterNumber = Number(chapterNumber);

      if (
        !Number.isInteger(parsedChapterNumber) ||
        parsedChapterNumber < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "chapterNumber must be a positive integer",
        });
      }
    }

    let parsedPublishedAt: Date | null | undefined;

    if (publishedAt !== undefined) {
      if (publishedAt === null) {
        parsedPublishedAt = null;
      } else {
        const date = new Date(publishedAt);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid publishedAt date",
          });
        }

        parsedPublishedAt = date;
      }
    }

    const chapter = await updateChapter({
      chapterId,
      authorId: userId,
      ...(title !== undefined ? { title } : {}),
      ...(parsedChapterNumber !== undefined
        ? { chapterNumber: parsedChapterNumber }
        : {}),
      ...(content !== undefined ? { content } : {}),
      ...(parsedPublishedAt !== undefined
        ? { publishedAt: parsedPublishedAt }
        : {}),
    });

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function publishChapterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await updateChapter({
      chapterId,
      authorId: userId,
      publishedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function unpublishChapterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await updateChapter({
      chapterId,
      authorId: userId,
      publishedAt: null,
    });

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteChapterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    await deleteChapter(chapterId, userId);

    return res.status(200).json({
      success: true,
      message: "Chapter deleted",
    });
  } catch (error) {
    next(error);
  }
}