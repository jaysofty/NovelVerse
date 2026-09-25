import { Router } from "express";

import {
  createGenerationController,
  getGenerationController,
  processGenerationController,
} from "./ai.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";



const router = Router();

router.post(
  "/generations",
  authMiddleware,
  createGenerationController,
);

router.get(
  "/generations/:id",
  authMiddleware,
  getGenerationController,
);

router.post(
  "/generations/:id/process",
  authMiddleware,
  processGenerationController,
);

export default router;