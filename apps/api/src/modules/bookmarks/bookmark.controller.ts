import type { Request, Response, NextFunction } from "express";

import {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
} from "./bookmark.service.js";

export async function createBookmarkController(
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

    const bookmark = await createBookmark(userId, novelId);

    return res.status(201).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBookmarkController(
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

    await deleteBookmark(userId, novelId);

    return res.json({
      success: true,
      message: "Bookmark removed",
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserBookmarksController(
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

    const bookmarks = await getUserBookmarks(userId);

    return res.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
}