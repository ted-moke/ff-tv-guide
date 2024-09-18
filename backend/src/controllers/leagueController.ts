import { Request, Response } from "express";
import { PlatformServiceFactory } from "../services/platforms/platformServiceFactory";
import { getDb } from "../firebase";

export const upsertLeague = async (req: Request, res: Response) => {
  const { leagueName, externalLeagueId, platformCredentialId, platformId } =
    req.body;

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
    });
    await platformService.upsertTeams(league);
    await platformService.upsertUserTeams({ league, userId, externalUserId });
    res.status(200).json({ message: "League connected successfully", league });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
