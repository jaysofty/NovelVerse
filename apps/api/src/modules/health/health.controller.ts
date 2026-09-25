import type { Request, Response } from "express";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: "NovelVerse API is healthy",
  });
}