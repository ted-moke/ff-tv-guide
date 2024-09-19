import { Request, Response } from "express";
import { PlatformServiceFactory } from "../services/platforms/platformServiceFactory";
import { getDb } from "../firebase";
import { League } from "../models/league";

export const upsertLeague = async (req: Request, res: Response) => {
  const {
    leagueName,
    externalLeagueId,
    platformCredentialId,
    platformId,
    externalTeamId,
  } = req.body;

  if (
    !leagueName ||
    !externalLeagueId ||
    !platformCredentialId ||
    !platformId
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

    const platformService = PlatformServiceFactory.getService(platformId);
    const league = await platformService.upsertLeague({
      leagueName,
      externalLeagueId,
      platformCredentialId,
      lastModified: new Date(), // Add this line
    });
    await platformService.upsertTeams(league);

    await platformService.upsertUserTeams({
      league,
      userId,
      externalUserId,
      externalTeamId,
    });
    res.status(200).json({ message: "League connected successfully", league });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateLeagueTeam = async (req: Request, res: Response) => {
  const { leagueId } = req.params;

  if (!leagueId) {
    return res.status(400).json({ error: "Missing league ID" });
  }

  try {
    const db = await getDb();
    const leagueRef = db.collection("leagues").doc(leagueId);
    const leagueDoc = await leagueRef.get();

    if (!leagueDoc.exists) {
      return res.status(404).json({ error: "League not found" });
    }

    const leagueData = leagueDoc.data()! as League;

    const platformService = PlatformServiceFactory.getService(
      leagueData.platform.name,
    );
    await platformService.upsertTeams(leagueData);

    // Update lastModified
    await leagueRef.update({ lastModified: new Date() });

    res.status(200).json({ message: "League teams updated successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAllLeagues = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const leaguesSnapshot = await db.collection("leagues").get();
    
    const updatePromises = leaguesSnapshot.docs.map(async (doc) => {
      const leagueData = doc.data() as League;
      const platformService = PlatformServiceFactory.getService(leagueData.platform.name);
      await platformService.upsertTeams(leagueData);
      
      // Update lastModified
      await doc.ref.update({ lastModified: new Date() });
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "All leagues updated successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getLeaguesPaginated = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startAfter = req.query.startAfter as string | undefined;

  try {
    const db = await getDb();
    let query = db.collection("leagues").orderBy("name");

    if (startAfter) {
      const startAfterDoc = await db.collection("leagues").doc(startAfter).get();
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.limit(limit + 1).get();
    const leagues = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const hasNextPage = snapshot.docs.length > limit;
    const nextStartAfter = hasNextPage ? snapshot.docs[limit - 1].id : null;

    res.json({
      leagues,
      hasNextPage,
      nextStartAfter
    });
  } catch (error) {
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
    const platformService = PlatformServiceFactory.getService(leagueData.platform.name);
    await platformService.upsertTeams(leagueData);

    await leagueRef.update({ lastModified: new Date() });

    res.status(200).json({ message: "League synced successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


