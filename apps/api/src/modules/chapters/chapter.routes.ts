import { Router } from "express";

import {
  getChapterByIdController,
  getAuthorChapterByIdController,
  getNovelChaptersController,
  createChapterController,
  updateChapterController,
  deleteChapterController,
   publishChapterController,
  unpublishChapterController,
} from "./chapter.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

/*
 * Public
 */

router.get(
  "/novel/:novelId",
  getNovelChaptersController,
);

router.get(
  "/:chapterId",
  getChapterByIdController,
);

/*
 * Author
 */

router.get(
  "/author/:chapterId",
  authMiddleware,
  getAuthorChapterByIdController,
);

router.post(
  "/novel/:novelId",
  authMiddleware,
  createChapterController,
);

router.patch(
  "/:chapterId",
  authMiddleware,
  updateChapterController,
);

router.patch(
  "/:chapterId/publish",
  authMiddleware,
  publishChapterController,
);

router.patch(
  "/:chapterId/unpublish",
  authMiddleware,
  unpublishChapterController,
);


router.delete(
  "/:chapterId",
  authMiddleware,
  deleteChapterController,
);

export default router;