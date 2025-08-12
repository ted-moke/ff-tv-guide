import { Router } from "express";
import { getUserTeamHistory } from "../controllers/userTeamHistoryController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Get user's team history across all seasons
router.get("/:userId/history", authenticate, getUserTeamHistory);

export default router;
