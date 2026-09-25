import { Router } from "express";

import healthRoutes from "../modules/health/health.routes.ts";
import novelRoutes from "../modules/novels/novel.routes.ts";
import chapterRoutes from "../modules/chapters/chapter.routes.ts";
import authRoutes from "../modules/auth/auth.routes.ts";
import contentRoutes from "../modules/content/content.routes.ts";
import aiRoutes from "../modules/ai/ai.routes.ts"
import likeRoutes from "../modules/likes/like.routes.ts";
import commentRoutes from "../modules/comments/comment.routes.ts";
import bookmarkRoutes from "../modules/bookmarks/bookmark.routes.ts";
import readingProgressRoutes from "../modules/reading-progress/reading-progress.routes.ts";
import mediaRoutes from "../modules/media/media.routes.js";
import authorRoutes from "../modules/authors/author.routes.ts";
import { errorMiddleware } from "../middleware/error.middleware.ts";

const router = Router();

router.use("/health", healthRoutes);
router.use("/novels", novelRoutes);
router.use("/chapters", chapterRoutes);
router.use("/content", contentRoutes);
router.use("/authors", authorRoutes);
router.use("/ai", aiRoutes);
router.use("/auth", authRoutes);
router.use("/", likeRoutes);
router.use("/comment", commentRoutes);
router.use("/", bookmarkRoutes);
router.use("/reading-progress", readingProgressRoutes);
router.use("/", mediaRoutes);
router.use(errorMiddleware);

export default router;