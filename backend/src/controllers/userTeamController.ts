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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

// Function to remove duplicates
export const removeUserTeamsDuplicates = async (
  req: Request,
  res: Response,
) => {
  const db = await getDb();
  const userTeamsCollection = db.collection("userTeams");

  try {
    const userTeamsSnapshot = await userTeamsCollection.get();
    const userTeamsMap = new Map<string, FirebaseFirestore.DocumentSnapshot>();

    for (const doc of userTeamsSnapshot.docs) {
      const data = doc.data();
      const key = `${data.userId}-${data.teamId}`;

      if (userTeamsMap.has(key)) {
        // Duplicate found, delete the current document
        await doc.ref.delete();
        console.log(`Deleted duplicate userTeam: ${doc.id}`);
      } else {
        // No duplicate, add to the map
        userTeamsMap.set(key, doc);
      }
    }

    console.log("Duplicate removal process completed.");
    res.status(200).json({ message: "Duplicate removal process completed." });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error removing duplicates:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
};

// Function to get duplicates
export const getUserTeamsDuplicates = async (req: Request, res: Response) => {
  console.log("Getting user teams duplicates");
  try {
    const db = await getDb();
    const userTeamsCollection = db.collection("userTeams");

    const userTeamsSnapshot = await userTeamsCollection.get();
    const userTeamsMap = new Map<string, FirebaseFirestore.DocumentSnapshot>();
    const duplicates: FirebaseFirestore.DocumentData[] = [];

    for (const doc of userTeamsSnapshot.docs) {
      const data = doc.data();
      const key = `${data.userId}-${data.teamId}`;

      if (userTeamsMap.has(key)) {
        // Duplicate found, add to duplicates array
        duplicates.push(data);
      } else {
        // No duplicate, add to the map
        userTeamsMap.set(key, doc);
      }
    }

    res.status(200).json({ duplicates });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching duplicates:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
};
