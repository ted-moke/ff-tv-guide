import express from "express";
import { TradeController } from "../controllers/tradeController";

const router = express.Router();

// Route to sync trades for a league
router.post("/leagues/:leagueId/sync-trades", TradeController.syncTradesForLeague);

// Route to get all trades for a league
router.get("/leagues/:leagueId/trades", TradeController.getTradesForLeague);

export default router; 