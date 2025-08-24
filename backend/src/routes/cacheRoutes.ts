import { Router } from "express";
import { getCacheInfo, clearCache } from "../controllers/cacheController";

const router = Router();

router.get("/info", getCacheInfo);
router.post("/clear", clearCache);

export default router;
