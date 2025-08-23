import { Request, Response } from "express";
import { getDb } from "../firebase";
import { Team } from "../models/team";
import { fetchUserTeamsWithNeedsUpdate } from "../services/userTeamServices";

export const getUserTeams = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { seasonStart, seasonEnd } = req.query as {
    seasonStart: string;
    seasonEnd: string | null;
  };

  try {
    let { teams, seasonsPresent } = await fetchUserTeamsWithNeedsUpdate(
      uid,
      seasonStart,
      seasonEnd,
    );

    let priorYearTeams: Team[] = [];
    let priorYearSeasons: number[] = [];

    console.log("teams before prior check", teams.length);

    if (teams.length === 0) {
      console.log(
        `No teams found for user for ${uid} and season ${seasonStart} to ${seasonEnd}`,
      );
      console.log("Trying prior season");
      const priorYear = (parseInt(seasonStart) - 1).toString();
      const { teams: localpriorYearTeams, seasonsPresent: localpriorYearSeasons } = await fetchUserTeamsWithNeedsUpdate(
        uid,
        priorYear,
        priorYear,
      );
      priorYearTeams = localpriorYearTeams;
      priorYearSeasons = localpriorYearSeasons;

      if (priorYearTeams.length === 0) {
        console.log(`No teams found for user for ${uid} and season ${priorYear}`);
        return res.status(200).json({ teamsBySeason: {}, teamsNeedingUpdate: [], teamsNeedingMigrate: [] });
      }
    }

    const allTeams = [...teams, ...priorYearTeams];
    const allSeasons = new Set([...seasonsPresent, ...priorYearSeasons]);

    let teamsBySeason: Record<string, Team[]> = {};

    for (const team of allTeams) {
      console.log("team", team);
      const season = team.season || 0;
      if (!teamsBySeason[season]) {
        teamsBySeason[season] = [];
      }
      teamsBySeason[season].push(team);
      console.log('teamsbyseason', teamsBySeason);
    }

    const teamsNeedingUpdate = allTeams.filter((team) => team.needsUpdate);
    const teamsNeedingMigrate = allTeams.filter((team) => team.needsMigrate);
    

    res.status(200).json({ teamsBySeason, teamsNeedingUpdate, teamsNeedingMigrate });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: (error as Error).message });
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

// New function to get opponent teams
export const getOpponentTeams = async (req: Request, res: Response) => {
  const userId = req.params.uid;

  try {
    const db = await getDb();
    // Get user teams
    const userTeamsSnapshot = await db
      .collection("userTeams")
      .where("userId", "==", userId)
      .get();

    const teamIds = userTeamsSnapshot.docs.map((doc) => doc.data().teamId);

    if (teamIds.length === 0) {
      return res.status(200).json({ teams: [], opponents: [] });
    }

    // Fetch user teams
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

    // Fetch opponent teams
    const opponentQueries = teams.map((team) => {
      return db
        .collection("teams")
        .where("externalTeamId", "==", team.opponentId)
        .where("leagueId", "==", team.leagueId)
        .get();
    });

    const opponentTeamsSnapshots = await Promise.all(opponentQueries);

    const opponents = opponentTeamsSnapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => {
        const team = doc.data() as Team;
        return {
          ...team,
          id: doc.id,
        };
      }),
    );

    res.status(200).json({ opponents });
  } catch (error) {
    console.error("Error fetching opponent teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUserTeamsPaginated = async (req: Request, res: Response) => {
  try {
    console.log("Getting all user teams paginated");
    const limit = parseInt(req.query.limit as string) || 10;
    const startAfter = (req.query.startAfter as string) || null;
    const endBefore = (req.query.endBefore as string) || null;

    const db = await getDb();
    let query = db.collection("userTeams").orderBy("__name__").limit(limit);

    let userTeamsSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null =
      null;
    let userTeamDocs: FirebaseFirestore.DocumentData[] = [];
    if (startAfter) {
      const startAfterDoc = await db
        .collection("userTeams")
        .doc(startAfter)
        .get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
      userTeamsSnapshot = await query.get();
      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit);
    } else if (endBefore) {
      const endBeforeDoc = await db
        .collection("userTeams")
        .doc(endBefore)
        .get();
      if (endBeforeDoc.exists) {
        query = query.endAt(endBeforeDoc);
      }
      userTeamsSnapshot = await query.get();

      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit);
    } else {
      userTeamsSnapshot = await query.get();
      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit);
    }

    if (!userTeamsSnapshot) {
      throw new Error("No user teams snapshot");
    }

    const firstDoc = userTeamDocs[0];
    const lastDoc = userTeamDocs[userTeamDocs.length - 1];

    const userTeams = userTeamDocs.map((doc) => {
      return {
        ...doc.data(),
        docId: doc.id,
      };
    });

    res.status(200).json({
      teams: userTeams,
      nextStartAfter: lastDoc?.id || null,
      prevEndBefore: firstDoc?.id || null,
    });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
