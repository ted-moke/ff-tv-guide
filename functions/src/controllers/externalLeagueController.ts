import { Request, Response } from "express";
import { db } from "../firebase";
import fetchFromUrl from "../utils/fetchFromUrl";

const FLEAFLICKER_API_URL =
  "https://www.fleaflicker.com/api/FetchUserLeagues?sport=NFL&email=";
const SLEEPER_API_URL = "https://api.sleeper.app/v1/user";

export const getExternalLeagues = async (req: Request, res: Response) => {
  const { credentialId } = req.query;

  if (!credentialId) {
    return res.status(400).json({ error: "Missing credentialId" });
  }

  try {
    const credentialDoc = await db
      .collection("platformCredentials")
      .doc(credentialId as string)
      .get();
    if (!credentialDoc.exists) {
      return res.status(404).json({ error: "Credential not found" });
    }

    const credential = credentialDoc.data();
    const platformId = credential?.platformId;

    if (!platformId) {
      return res.status(400).json({ error: "Missing platformId" });
    }

    let leagues;

    if (platformId === "fleaflicker") {
      leagues = await fetchFromUrl(
        `${FLEAFLICKER_API_URL}${credential.credential}`,
      );
      leagues = leagues?.leagues.map((league: any) => ({
        ...league,
        id: league.id, // Fleaflicker uses 'id'
      }));
    } else if (platformId === "sleeper") {
      leagues = await fetchFromUrl(
        `${SLEEPER_API_URL}/${credential.externalUserId}/leagues/nfl/2024`,
      );
      leagues = leagues.map((league: any) => ({
        ...league,
        id: league.league_id, // Sleeper uses 'league_id'
      }));
    } else {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    if (!leagues) {
      return res.status(404).json({ error: "No leagues found" });
    }

    return res.json(leagues);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
