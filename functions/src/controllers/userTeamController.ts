import { Request, Response } from "express";
import { db } from "../firebase";
import { Team } from "../models/team";

export const getUserTeams = async (req: Request, res: Response) => {
  console.log("getUserTeams function called");
  const userId = req.params.uid; // This should match the route parameter
  console.log("Fetching teams for user:", userId);

  try {
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

    console.log("Teams:", teams);

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
