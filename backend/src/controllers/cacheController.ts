import { Request, Response } from "express";
import { getDeploymentInfo } from "../utils/deploymentInfo";

export const getCacheInfo = async (req: Request, res: Response) => {
  try {
    const deploymentInfo = getDeploymentInfo();
    
    res.status(200).json({
      message: "Cache information",
      deployment: deploymentInfo,
      cacheHeaders: {
        cacheControl: "no-cache, no-store, must-revalidate",
        pragma: "no-cache",
        expires: "0"
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error getting cache info:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const clearCache = async (req: Request, res: Response) => {
  try {
    // This endpoint can be used to trigger cache clearing on the client side
    res.status(200).json({
      message: "Cache clear request received",
      timestamp: Date.now(),
      deployment: getDeploymentInfo(),
      instructions: "Client should clear local cache and reload data"
    });
  } catch (error) {
    console.error("Error in clear cache:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
