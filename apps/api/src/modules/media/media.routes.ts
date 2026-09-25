import { Router } from "express";

import {
  createMediaController,
  getNovelMediaController,
  getMediaController,
  deleteMediaController,
} from "./media.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router();

router.post(
  "/novels/:novelId/media",
  authMiddleware,
  createMediaController,
);

router.get(
  "/novels/:novelId/media",
  getNovelMediaController,
);

router.get(
  "/media/:mediaId",
  getMediaController,
);

router.delete(
  "/media/:mediaId",
  authMiddleware,
  deleteMediaController,
);

export default router;