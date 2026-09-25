import type { Request, Response, NextFunction } from "express";
import { getNovelMedia } from "./content.service.js";

export async function getNovelMediaController(
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

    const media = await getNovelMedia(novelId);

    return res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
}