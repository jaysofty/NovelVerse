import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createMedia,
  getNovelMedia,
  getMediaById,
  deleteMedia,
} from "./media.service.js";

export async function createMediaController(
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

    const {
      type,
      url,
      mimeType,
      fileName,
      fileSize,
      duration,
    } = req.body;

    if (!type || !url) {
      return res.status(400).json({
        success: false,
        message: "type and url are required",
      });
    }

    const media = await createMedia({
      novelId,
      type,
      url,
      mimeType,
      fileName,
      fileSize,
      duration,
    });

    return res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNovelMediaController(
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

    const media = await getNovelMedia(novelId);

    return res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { mediaId } = req.params;

    if (!mediaId || Array.isArray(mediaId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media ID",
      });
    }

    const media = await getMediaById(mediaId);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { mediaId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!mediaId || Array.isArray(mediaId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media ID",
      });
    }

    await deleteMedia(mediaId, userId);

    return res.json({
      success: true,
      message: "Media deleted",
    });
  } catch (error) {
    next(error);
  }
}