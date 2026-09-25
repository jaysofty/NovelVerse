import { Router } from "express";

import {
  createNovelController,
  getNovelsController,
  getNovelBySlugController,
} from "./novel.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

// Public routes
router.get("/", getNovelsController);
router.get("/:slug", getNovelBySlugController);


// Author-only routes
router.post(
  "/",
  authMiddleware,
  requireRole("AUTHOR"),
  createNovelController,
);



export default router;