import { Router } from "express";
import { getContentionStats, clearContentionEvents } from "../controllers/debugController";

const router = Router();

// Debug routes for monitoring contention
router.get("/contention-stats", getContentionStats);
router.delete("/contention-events", clearContentionEvents);

export default router;
