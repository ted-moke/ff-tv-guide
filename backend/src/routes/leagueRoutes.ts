import { Router } from "express";
import {
  upsertLeague,
  updateAllLeagues,
  getLeaguesPaginated,
  syncLeague,
  getLeagueStats,
  updateLeaguesByIdsRoute, // Import the new route handler
} from "../controllers/leagueController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", upsertLeague);
router.put("/update-all", authenticate, updateAllLeagues);
router.get("/", authenticate, getLeaguesPaginated);
router.post("/:leagueId/sync", authenticate, syncLeague);
router.get("/stats", getLeagueStats);

// New route for updating leagues by IDs
router.put("/update-by-ids", authenticate, updateLeaguesByIdsRoute);

export default router;
