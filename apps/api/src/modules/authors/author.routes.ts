import { Router } from "express";

import {
  createNovelController,
  getAuthorByUsernameController,
  getAuthorNovelController,
  getMyAuthorProfileController,
  getAuthorChapterByIdController,
  updateAuthorNovelController,
  publishAuthorNovelController,
  unpublishAuthorNovelController,
  followAuthorController,
  unfollowAuthorController,
  getAuthorFollowStatusController,
} from "./author.controller.ts";

import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";
import { deleteNovelController } from "../novels/novel.controller.ts";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  requireRole("AUTHOR"),
  getMyAuthorProfileController,
);

router.post(
  "/me/novels",
  authMiddleware,
  requireRole("AUTHOR"),
  createNovelController,
);

router.get(
  "/me/novels/:id",
  authMiddleware,
  requireRole("AUTHOR"),
  getAuthorNovelController,
);

router.patch(
  "/me/novels/:id",
  authMiddleware,
  requireRole("AUTHOR"),
  updateAuthorNovelController,
);

router.delete(
  "/me/novels/:id",
  authMiddleware,
  requireRole("AUTHOR"),
  deleteNovelController,
);

router.patch(
  "/me/novels/:id/publish",
  authMiddleware,
  requireRole("AUTHOR"),
  publishAuthorNovelController,
);

router.patch(
  "/me/novels/:id/unpublish",
  authMiddleware,
  requireRole("AUTHOR"),
  unpublishAuthorNovelController,
);
// Author chapter management
router.get(
  "/me/chapters/:chapterId",
  authMiddleware,
  requireRole("AUTHOR"),
  getAuthorChapterByIdController,
);
router.post("/:username/follow", authMiddleware, followAuthorController);

router.delete("/:username/follow", authMiddleware, unfollowAuthorController);

router.get(
  "/:username/follow-status",
  authMiddleware,
  getAuthorFollowStatusController,
);
router.get("/:username", getAuthorByUsernameController);

export default router;
