import { Request, Response } from "express";
import { PlatformServiceFactory } from "../services/platforms/platformServiceFactory";
import { getDb } from "../firebase";
import type { League } from "../types/shared";
import { LeagueMasterService } from "../services/leagueMasterService";
import { startBackgroundJob } from "../utils/backgroundJobs";

const BATCH_SIZE = 7; // Adjust as needed

export const upsertLeague = async (req: Request, res: Response) => {
  const {
    leagueName,
    externalLeagueId,
    platformCredentialId,
    platformId,
    externalTeamId,
    season = 2025, // Default to current season
  } = req.body;

  if (
    !leagueName ||
    !externalLeagueId ||
    !platformCredentialId ||
    !platformId ||
    !season
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const db = await getDb();
    const platformCredentialRef = db
      .collection("platformCredentials")
      .doc(platformCredentialId);
    const platformCredentialDoc = await platformCredentialRef.get();

    if (!platformCredentialDoc.exists) {
      return res.status(404).json({ error: "Platform credential not found" });
    }

    const userId = platformCredentialDoc.data()!.userId;
    const externalUserId = platformCredentialDoc.data()!.externalUserId;

    // Find or create LeagueMaster
    const leagueMaster = await LeagueMasterService.findOrCreateLeagueMaster({
      name: leagueName,
      platform: { name: platformId as "sleeper" | "fleaflicker", id: platformId },
      externalLeagueId,
      createdBy: userId,
    });

    const platformService = PlatformServiceFactory.getService(platformId);

    // Upsert the league
    const league = await platformService.upsertLeague({
      leagueName,
      externalLeagueId,
      platformCredentialId,
      leagueMasterId: leagueMaster.id!,
      season,
    });

    // Upsert the teams
    await platformService.upsertTeams(league);

    // Upsert the user teams
    await platformService.upsertUserTeams({
      league,
      userId,
      externalUserId,
      externalTeamId,
    });
    
    res.status(200).json({ 
      message: "League connected successfully", 
      league,
      leagueMaster 
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAllLeagues = async (req: Request, res: Response) => {
  try {
    console.log("Initiating background job to update all leagues");

    // Start the background job
    startBackgroundJob(updateAllLeaguesBackground);

    res
      .status(202)
      .json({ message: "League update process initiated in the background" });
  } catch (error) {
    console.error("Error initiating league update process:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// New function to handle the background job
async function updateAllLeaguesBackground() {
  const db = await getDb();
  let lastProcessedId: string | null = null;
  let totalLeaguesProcessed = 0;

  while (true) {
    let query = db.collection("leagues").orderBy("__name__").limit(BATCH_SIZE);

    if (lastProcessedId) {
      query = query.startAfter(lastProcessedId);
    }

    const leaguesSnapshot = await query.get();

    if (leaguesSnapshot.empty) {
      break; // No more documents to process
    }

    console.log(
      `Processing batch of ${leaguesSnapshot.size} leagues. (${totalLeaguesProcessed} so far)`,
    );

    const updatePromises = leaguesSnapshot.docs.map(async (doc) => {
      const leagueData = doc.data() as League;
      console.log("Upserting teams for league:", leagueData.name);
      const platformService = PlatformServiceFactory.getService(
        leagueData.platform.name,
      );
      await platformService.upsertTeams(leagueData);

      // Update lastModified
      await doc.ref.update({ lastModified: new Date() });
    });

    await Promise.all(updatePromises);

    totalLeaguesProcessed += leaguesSnapshot.size;

    lastProcessedId = leaguesSnapshot.docs[leaguesSnapshot.docs.length - 1].id;
    console.log(`Batch completed. Last processed ID: ${lastProcessedId}`);

    // Wait for one minute between batches to avoid being rate limited
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Log memory usage
    const memoryUsage = process.memoryUsage();
    console.log("Memory usage after batch:", {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
    });

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log("Garbage collection forced");
    }
  }

  console.log(
    `All leagues updated successfully. Total leagues processed: ${totalLeaguesProcessed}`,
  );
}

export const getLeaguesPaginated = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startAfter = req.query.startAfter as string | undefined;
  const sortBy = (req.query.sortBy as string) || "name";
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

  // Filter parameters
  const season = req.query.season ? parseInt(req.query.season as string) : undefined;
  const externalLeagueId = req.query.externalLeagueId as string | undefined;
  const id = req.query.id as string | undefined;
  const leagueMasterId = req.query.leagueMasterId as string | undefined;
  const name = req.query.name as string | undefined;
  const nameSearch = req.query.nameSearch as string | undefined; // For contains search

  try {
    const db = await getDb();
    let query: any = db.collection("leagues");

    // Apply filters
    if (season !== undefined) {
      query = query.where("season", "==", season);
    }
    if (externalLeagueId) {
      // Use prefix search for external league ID
      const searchTerm = externalLeagueId;
      const endTerm = searchTerm + '\uf8ff';
      query = query.where("externalLeagueId", ">=", searchTerm).where("externalLeagueId", "<=", endTerm);
    }
    if (leagueMasterId) {
      // Use prefix search for league master ID
      const searchTerm = leagueMasterId;
      const endTerm = searchTerm + '\uf8ff';
      query = query.where("leagueMasterId", ">=", searchTerm).where("leagueMasterId", "<=", endTerm);
    }
    if (name) {
      // Use prefix search for name
      const searchTerm = name;
      const endTerm = searchTerm + '\uf8ff';
      query = query.where("name", ">=", searchTerm).where("name", "<=", endTerm);
    } else if (nameSearch) {
      // For contains search - use prefix matching
      // This will find names that start with the search term
      const searchTerm = nameSearch;
      const endTerm = searchTerm + '\uf8ff'; // Unicode character that comes after most characters
      console.log("Searching for names starting with:", searchTerm);
      console.log("End term:", endTerm);
      query = query.where("name", ">=", searchTerm).where("name", "<=", endTerm);
    }
    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);

    // Apply pagination
    if (startAfter) {
      const startAfterDoc = await db
        .collection("leagues")
        .doc(startAfter)
        .get();
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.limit(limit + 1).get();
    console.log("Query returned", snapshot.docs.length, "documents");
    let leagues = snapshot.docs.slice(0, limit).map((doc: any) => {
      const data = doc.data();

      const leagueData: any = {
        id: doc.id,
        ...data,
      };

      if (data.lastModified != null) {
        leagueData.lastModified = data.lastModified.toDate();
      }

      return leagueData;
    });

    // Apply ID filter after fetching (since we can't use document ID in where clause with other filters)
    if (id) {
      leagues = leagues.filter((league: any) => league.id.startsWith(id));
    }

    const hasNextPage = snapshot.docs.length > limit;
    const nextStartAfter = hasNextPage ? snapshot.docs[limit - 1].id : null;

    res.json({
      leagues,
      hasNextPage,
      nextStartAfter,
    });
  } catch (error) {
    console.log("Error in getLeaguesPaginated", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const syncLeague = async (req: Request, res: Response) => {
  const { leagueId } = req.params;

  try {
    const db = await getDb();
    const leagueRef = db.collection("leagues").doc(leagueId);
    const leagueDoc = await leagueRef.get();

    if (!leagueDoc.exists) {
      return res.status(404).json({ error: "League not found" });
    }

    const leagueData = leagueDoc.data() as League;
    const platformService = PlatformServiceFactory.getService(
      leagueData.platform.name,
    );
    await platformService.upsertTeams(leagueData);

    await leagueRef.update({ lastModified: new Date() });

    res.status(200).json({ message: "League synced successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export interface LeagueStats {
  totalLeagues: number;
  platformCounts: { [key: string]: number };
}

export const getLeagueStats = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const leaguesSnapshot = await db.collection("leagues").get();
    const totalLeagues = leaguesSnapshot.size;

    const platformCounts: { [key: string]: number } = {};
    leaguesSnapshot.forEach((doc) => {
      const leagueData = doc.data() as League;
      const platformName = leagueData.platform.name;
      if (!platformCounts[platformName]) {
        platformCounts[platformName] = 0;
      }
      platformCounts[platformName]++;
    });

    const stats: LeagueStats = {
      totalLeagues,
      platformCounts,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

async function updateLeaguesByIds(
  ids: string[],
  idType: "internal" | "external" = "internal"
) {
  const db = await getDb();
  const updatePromises = ids.map(async (id) => {
    let leagueRef;
    if (idType === "internal") {
      leagueRef = db.collection("leagues").doc(id);
    } else {
      const querySnapshot = await db
        .collection("leagues")
        .where("externalLeagueId", "==", id)
        .get();
      if (querySnapshot.empty) {
        console.log(`League with external ID ${id} not found`);
        return;
      }
      leagueRef = querySnapshot.docs[0].ref;
    }

    const leagueDoc = await leagueRef.get();

    if (!leagueDoc.exists) {
      console.log(`League with ID ${id} not found`);
      return;
    }

    const leagueData = leagueDoc.data() as League;
    const platformService = PlatformServiceFactory.getService(
      leagueData.platform.name
    );
    await platformService.upsertTeams(leagueData);

    // Update lastModified
    await leagueRef.update({ lastModified: new Date() });
    console.log("League updated successfully", leagueData.name);
  });

  await Promise.all(updatePromises);
}

export const updateLeaguesByIdsRoute = async (req: Request, res: Response) => {
  const { ids, idType } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid or missing IDs" });
  }

  if (idType !== "internal" && idType !== "external") {
    return res.status(400).json({ error: "Invalid ID type" });
  }

  try {
    await updateLeaguesByIds(ids, idType);
    res.status(200).json({ message: "Leagues updated successfully" });
  } catch (error) {
    console.error("Error updating leagues by IDs:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
