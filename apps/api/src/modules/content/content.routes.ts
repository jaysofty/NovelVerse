import { Router } from "express";
import { getNovelMediaController } from "./content.controller.js";

const router = Router();

router.get("/novels/:novelId/media", getNovelMediaController);

export default router;