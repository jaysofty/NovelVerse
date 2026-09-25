import { Router } from "express";

import {
  likeNovelController,
  unlikeNovelController,
  getNovelLikesController,
  getUserLikeStatusController,
} from "./like.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.ts";



const router = Router();

router.get("/novels/:novelId/likes", getNovelLikesController);

router.get(
  "/novels/:novelId/like-status",
  authMiddleware,
  getUserLikeStatusController,
);

router.post(
  "/novels/:novelId/like",
  authMiddleware,
  likeNovelController,
);

router.delete(
  "/novels/:novelId/like",
  authMiddleware,
  unlikeNovelController,
);



export default router;