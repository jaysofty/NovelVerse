import { Router } from "express";

import {
  getChapterCommentsController,
  createCommentController,
  deleteCommentController,
  createReplyController,
} from "./comment.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router();

router.get("/chapters/:chapterId/comments", getChapterCommentsController);

router.post(
  "/chapters/:chapterId/comments",
  authMiddleware,
  createCommentController,
);

router.delete("/comments/:commentId", authMiddleware, deleteCommentController);

router.post(
  "/comments/:commentId/replies",
  authMiddleware,
  createReplyController,
);

export default router;
