import type { Request, Response, NextFunction } from "express";

import {
  likeNovel,
  unlikeNovel,
  getNovelLikes,
  hasUserLikedNovel,
} from "./like.service.js";

export async function likeNovelController(
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

    const existingLike = await hasUserLikedNovel(userId, novelId);

    if (existingLike) {
      return res.status(409).json({
        success: false,
        message: "Novel already liked",
      });
    }

    const like = await likeNovel(userId, novelId);

    return res.status(201).json({
      success: true,
      data: like,
    });
  } catch (error) {
    next(error);
  }
}

export async function unlikeNovelController(
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

    const existingLike = await hasUserLikedNovel(userId, novelId);

    if (!existingLike) {
      return res.status(404).json({
        success: false,
        message: "Novel is not liked",
      });
    }

    await unlikeNovel(userId, novelId);

    return res.json({
      success: true,
      message: "Novel unliked successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getNovelLikesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { novelId } = req.params;

    if (!novelId || Array.isArray(novelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const count = await getNovelLikes(novelId);

    return res.json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserLikeStatusController(
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

    const liked = await hasUserLikedNovel(
      userId,
      novelId,
    );

    return res.json({
      success: true,
      data: {
        liked,
      },
    });
  } catch (error) {
    next(error);
  }
}

