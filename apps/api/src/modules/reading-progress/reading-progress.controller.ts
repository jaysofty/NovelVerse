import type { Request, Response, NextFunction } from "express";

import {
  updateReadingProgress,
  getReadingProgress,
} from "./reading-progress.service.js";

export async function updateReadingProgressController(
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

    if (!novelId || Array.isArray(novelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const { chapterId, progress } = req.body;

    if (!chapterId || typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "chapterId is required",
      });
    }

    if (typeof progress !== "number") {
      return res.status(400).json({
        success: false,
        message: "progress must be a number",
      });
    }

    const readingProgress = await updateReadingProgress({
      userId,
      novelId,
      chapterId,
      progress,
    });

    return res.json({
      success: true,
      data: readingProgress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReadingProgressController(
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

    if (!novelId || Array.isArray(novelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const readingProgress = await getReadingProgress(
      userId,
      novelId,
    );

    return res.json({
      success: true,
      data: readingProgress,
    });
  } catch (error) {
    next(error);
  }
}