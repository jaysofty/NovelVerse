

import type { Request, Response, NextFunction } from "express";
import {
  createNovelSchema,
} from "./novel.schema.js";

import {
  createNovel,
  getNovels,
  getNovelBySlug,
    deleteNovel,
} from "./novel.service.js";
import { AppError } from "../../utils/AppError.ts";


export async function createNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = createNovelSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const novel = await createNovel(
      userId,
      result.data,
    );

    return res.status(201).json({
      success: true,
      data: novel,
    });
  } catch (error) {
    next(error);
  }
}



export async function getNovelsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "PUBLISHED";

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "limit must be between 1 and 50",
      });
    }

    const allowedStatuses = [
      "DRAFT",
      "PUBLISHED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid novel status",
      });
    }

const result = await getNovels({
  page,
  limit,
  ...(search ? { search } : {}),
  status: status as "DRAFT" | "PUBLISHED" | "COMPLETED",
});

    return res.json({
      success: true,
      data: result.novels,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNovelBySlugController(
  req: Request,
  res: Response,
) {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel slug",
      });
    }

    const novel = await getNovelBySlug(slug);

 if (!novel) {
  throw new AppError(
    "Novel not found or you are not the author",
    404,
    "NOVEL_NOT_FOUND",
  );
}

    return res.status(200).json({
      success: true,
      data: novel,
    });
  } catch (error) {
    console.error("Failed to fetch novel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch novel",
    });
  }
}
export async function deleteNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorId = req.user?.userId;

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Novel ID is required",
      });
    }

    const deletedNovel = await deleteNovel(id, authorId);

    return res.status(200).json({
      success: true,
      message: "Novel deleted successfully",
      data: deletedNovel,
    });
  } catch (error) {
    next(error);
  }
}