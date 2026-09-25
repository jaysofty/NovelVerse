import { Router } from "express";

import {
  createBookmarkController,
  deleteBookmarkController,
  getUserBookmarksController,
} from "./bookmark.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";



const router = Router();

router.post(
  "/novels/:novelId/bookmark",
  authMiddleware,
  createBookmarkController,
);

router.delete(
  "/novels/:novelId/bookmark",
  authMiddleware,
  deleteBookmarkController,
);

router.get(
  "/bookmarks",
  authMiddleware,
  getUserBookmarksController,
);

export default router;