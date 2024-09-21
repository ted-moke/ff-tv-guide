import { Router } from "express";
import {
  upsertLeague,
  updateLeagueTeam,
  updateRosters,
  updateExternalInfo,
  getLeaguesPaginated,
  syncLeague,
  getLeagueStats,
} from "../controllers/leagueController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, upsertLeague);
router.put("/:leagueId/teams", authenticate, updateLeagueTeam);
router.put("/update-rosters", authenticate, updateRosters); // Renamed route
router.put("/update-external-info", authenticate, updateExternalInfo); // New route
router.get("/", authenticate, getLeaguesPaginated);
router.post("/:leagueId/sync", authenticate, syncLeague);
router.get("/stats", authenticate, getLeagueStats);

export default router;
