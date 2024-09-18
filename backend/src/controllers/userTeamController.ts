import { Request, Response } from "express";
import { getDb } from "../firebase";
import { Team } from "../models/team";

export const getUserTeams = async (req: Request, res: Response) => {
  const userId = req.params.uid; // This should match the route parameter

  console.log("Getting user teams for user:", userId);

  try {
    const db = await getDb();
    // Get user teams
    const userTeamsSnapshot = await db
      .collection("userTeams")
      .where("userId", "==", userId) // Changed from uid to userId
      .get();

    const teamIds = userTeamsSnapshot.docs.map((doc) => doc.data().teamId);

    // Early return if no team IDs
    if (teamIds.length === 0) {
      console.log("No teams found for user:", userId);
      return res.status(200).json({ teams: [] });
    }

    console.log("Team IDs:", teamIds);

    // Fetch full team data
    const teamsSnapshot = await db
      .collection("teams")
      .where("id", "in", teamIds)
      .get();

    const teams = teamsSnapshot.docs.map((doc) => {
      const team = doc.data() as Team;
      return {
        ...team,
        id: doc.id,
      };
    });

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
