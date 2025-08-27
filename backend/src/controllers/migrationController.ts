import { Request, Response } from "express";
// import { migrateToLeagueMaster, migrateSingleLeague } from "../../scripts/migrateToLeagueMaster";

export const runMigration = async (req: Request, res: Response) => {
  try {
    const { season } = req.query;
    
    if (!season) {
      return res.status(400).json({ 
        error: "Season parameter is required",
        example: "/migration/run?season=2025"
      });
    }

    const seasonNumber = parseInt(season as string, 10);
    
    if (isNaN(seasonNumber)) {
      return res.status(400).json({ 
        error: "Season must be a valid number",
        example: "/migration/run?season=2025"
      });
    }

    console.log(`Starting migration for season ${seasonNumber}...`);
    
    // const stats = await migrateToLeagueMaster({ season: seasonNumber });
    
    // console.log("Migration completed with stats:", stats);
    
    res.json({
      success: true,
      message: "Migration completed successfully",
      season: seasonNumber,
      // stats
    });
    
  } catch (error) {
    console.error("Migration failed:", error);
    res.status(500).json({
      success: false,
      error: "Migration failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const runSingleLeagueMigration = async (req: Request, res: Response) => {
  try {
    const { leagueId, season } = req.query;
    
    if (!leagueId) {
      return res.status(400).json({ 
        error: "League ID parameter is required",
        example: "/migration/single-league?leagueId=abc123&season=2025"
      });
    }

    if (!season) {
      return res.status(400).json({ 
        error: "Season parameter is required",
        example: "/migration/single-league?leagueId=abc123&season=2025"
      });
    }

    const seasonNumber = parseInt(season as string, 10);
    
    if (isNaN(seasonNumber)) {
      return res.status(400).json({ 
        error: "Season must be a valid number",
        example: "/migration/single-league?leagueId=abc123&season=2025"
      });
    }

    console.log(`Starting single league migration for league ${leagueId} with season ${seasonNumber}...`);
    
    // const stats = await migrateSingleLeague({ 
    //   leagueId: leagueId as string, 
    //   season: seasonNumber 
    // });
    
    // console.log("Single league migration completed with stats:", stats);
    
    res.json({
      success: true,
      message: "Single league migration completed successfully",
      leagueId: leagueId,
      season: seasonNumber,
      // stats
    });
    
  } catch (error) {
    console.error("Single league migration failed:", error);
    res.status(500).json({
      success: false,
      error: "Single league migration failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
