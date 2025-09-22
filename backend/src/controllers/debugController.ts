import { Request, Response } from "express";
import { ContentionMonitor } from "../utils/contentionMonitor";

export const getContentionStats = async (req: Request, res: Response) => {
  try {
    const contentionMonitor = ContentionMonitor.getInstance();
    const stats = await contentionMonitor.getContentionStatsFromFirestore();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting contention stats:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const clearContentionEvents = async (req: Request, res: Response) => {
  try {
    const contentionMonitor = ContentionMonitor.getInstance();
    contentionMonitor.clearEvents();
    
    res.json({
      success: true,
      message: "Contention events cleared from memory",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error clearing contention events:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
