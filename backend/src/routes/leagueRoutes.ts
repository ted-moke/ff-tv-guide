import { Router } from "express";
import {
  upsertLeague,
  updateAllLeagues,
  getLeaguesPaginated,
  syncLeague,
  getLeagueStats,
} from "../controllers/leagueController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", upsertLeague);
router.put("/update-all", authenticate, updateAllLeagues);
router.get("/", authenticate, getLeaguesPaginated);
router.post("/:leagueId/sync", authenticate, syncLeague);
router.get("/stats", getLeagueStats);

export default router;
