import { Request, Response } from "express";
import { getDb } from "../firebase";
import { TradeServiceFactory } from "../services/platforms/tradeServiceFactory";

export class TradeController {
  /**
   * Sync trades for a specific league
   */
  static async syncTradesForLeague(req: Request, res: Response) {
    try {
      const { leagueId } = req.params;
      
      if (!leagueId) {
        return res.status(400).json({ error: "League ID is required" });
      }
      
      // Get the league from the database
      const db = await getDb();
      const leagueDoc = await db.collection("leagues").doc(leagueId).get();
      
      if (!leagueDoc.exists) {
        return res.status(404).json({ error: "League not found" });
      }
      
      const league = leagueDoc.data();
      if (!league) {
        return res.status(404).json({ error: "League data not found" });
      }
      
      // Get the appropriate trade service based on the platform
      const tradeService = TradeServiceFactory.getTradeService(league.platform.name);
      
      // Sync trades for the league
      await tradeService.syncTrades(leagueId, league.externalLeagueId);
      
      return res.status(200).json({ 
        message: "Trades synced successfully",
        leagueId,
        platform: league.platform.name
      });
    } catch (error) {
      console.error("Error syncing trades:", error);
      return res.status(500).json({ 
        error: "Failed to sync trades", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  /**
   * Get all trades for a specific league
   */
  static async getTradesForLeague(req: Request, res: Response) {
    try {
      const { leagueId } = req.params;
      
      if (!leagueId) {
        return res.status(400).json({ error: "League ID is required" });
      }
      
      // Get trades from the database
      const db = await getDb();
      const tradesSnapshot = await db.collection("trades")
        .where("leagueId", "==", leagueId)
        .orderBy("proposedAt", "desc")
        .get();
      
      const trades = tradesSnapshot.docs.map(doc => doc.data());
      
      return res.status(200).json(trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      return res.status(500).json({ 
        error: "Failed to fetch trades", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
} 