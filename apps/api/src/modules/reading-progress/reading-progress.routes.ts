import { Router } from "express";

import {
  updateReadingProgressController,
  getReadingProgressController,
} from "./reading-progress.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router();

router.post(
  "/novels/:novelId/progress",
  authMiddleware,
  updateReadingProgressController,
);

router.get(
  "/novels/:novelId/progress",
  authMiddleware,
  getReadingProgressController,
);

export default router;