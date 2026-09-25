import type { Request, Response, NextFunction } from "express";

import {
  createGeneration,
  getGenerationById,
  processGeneration,
} from "./ai.service.js";

export async function createGenerationController(
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

    const { type, prompt, novelId } = req.body;

    if (!type || !prompt) {
      return res.status(400).json({
        success: false,
        message: "type and prompt are required",
      });
    }

    const generation = await createGeneration({
      userId,
      type,
      prompt,
      novelId,
    });

    // Start processing without making the client wait.
    void processGeneration(generation.id, userId).catch((error) => {
      console.error(
        `AI generation ${generation.id} failed:`,
        error,
      );
    });

    return res.status(201).json({
      success: true,
      data: generation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGenerationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid generation ID",
      });
    }

    const generation = await getGenerationById(id, userId);

    if (!generation) {
      return res.status(404).json({
        success: false,
        message: "Generation not found",
      });
    }

    return res.json({
      success: true,
      data: generation,
    });
  } catch (error) {
    next(error);
  }
}

export async function processGenerationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid generation ID",
      });
    }

    const generation = await processGeneration(id, userId);

    return res.json({
      success: true,
      data: generation,
    });
  } catch (error) {
    next(error);
  }
}