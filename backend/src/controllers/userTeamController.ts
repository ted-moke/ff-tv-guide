import { Request, Response } from "express";
import { getDb } from "../firebase";
import { Team } from "../models/team";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

const TIME_TO_TEAM_STALE = 20 * 60 * 1000; // 20 minutes

// Define Zod schemas for Date and Timestamp
const dateSchema = z.instanceof(Date);
const timestampSchema = z.instanceof(Timestamp);

// Combined schema that accepts either Date or Timestamp
const dateOrTimestampSchema = z.union([dateSchema, timestampSchema]);

export const getUserTeams = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { seasonStart, seasonEnd } = req.query as { seasonStart: string, seasonEnd: string | null };

  try {
    const teams = await getTeamsForUser(uid, seasonStart, seasonEnd);
    const mostRecentKeyTime = getMostRecentKeyTime();
    const staleTime = new Date(Date.now() - TIME_TO_TEAM_STALE);

    console.log('teams', teams.length)

    // Augment each team with the 'needsUpdate' parameter
    const augmentedTeams = teams.map((team) => {
      const lastFetchedDate =
        team.lastFetched instanceof Timestamp
          ? team.lastFetched.toDate()
          : team.lastFetched instanceof Date
            ? team.lastFetched
            : null;

      console.log('lastFetchedDate', lastFetchedDate)

      return {
        ...team,
        needsUpdate:
          lastFetchedDate == null ||
          mostRecentKeyTime == null ||
          lastFetchedDate < mostRecentKeyTime ||
          lastFetchedDate < staleTime,
      };
    });

    const teamsWithNoLastFetched = augmentedTeams.filter((team) => team.lastFetched == null);
    const teamsWithNeedsUpdate = augmentedTeams.filter((team) => team.needsUpdate);

    console.log('teamsWithNoLastFetched', teamsWithNoLastFetched.length)
    console.log('teamsWithNeedsUpdate', teamsWithNeedsUpdate.length)

    res.status(200).json({ teams: augmentedTeams });
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
    const startAfter = req.query.startAfter as string || null;
    const endBefore = req.query.endBefore as string || null;

    const db = await getDb();
    let query = db.collection("userTeams").orderBy("__name__").limit(limit);
    
    let userTeamsSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null = null;
    let userTeamDocs: FirebaseFirestore.DocumentData[] = [];
    if (startAfter) {
      const startAfterDoc = await db.collection("userTeams").doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
      userTeamsSnapshot = await query.get();
      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit)
    } else if (endBefore) {
      const endBeforeDoc = await db.collection("userTeams").doc(endBefore).get();
      if (endBeforeDoc.exists) {
        query = query.endAt(endBeforeDoc);
      }
      userTeamsSnapshot = await query.get();

      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit)
    } else {
      userTeamsSnapshot = await query.get();
      userTeamDocs = userTeamsSnapshot.docs.slice(0, limit)
    }
    

    if (!userTeamsSnapshot) {
      throw new Error("No user teams snapshot");
    }

    const firstDoc = userTeamDocs[0];
    const lastDoc = userTeamDocs[userTeamDocs.length - 1];

    const userTeams = userTeamDocs.map((doc) => {
      return {
        ...doc.data(),
        docId: doc.id
      }
    });

    res.status(200).json({ 
      teams: userTeams, 
      nextStartAfter: lastDoc?.id || null,
      prevEndBefore: firstDoc?.id || null
    });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};



async function getTeamsForUser(userId: string, seasonStart: string, seasonEnd: string | null): Promise<Team[]> {
  console.log("Getting teams for user", userId);
  const db = await getDb();

  const seasonStartNumber = parseInt(seasonStart);
  const seasonEndNumber = seasonEnd ? parseInt(seasonEnd) : null;


  let query = db
    .collection("userTeams")
    .where("userId", "==", userId)
    .where("currentSeason", ">=", seasonStartNumber)

  if (seasonEndNumber) {
    query = query.where("currentSeason", "<=", seasonEndNumber);
  }

  const userTeamsSnapshot = await query.get();

  const teamIds = userTeamsSnapshot.docs.map((doc) => doc.data().teamId);

  if (teamIds.length === 0) {
    return [];
  }

  const teamsSnapshot = await db
    .collection("teams")
    .where("id", "in", teamIds)
    .get();

  const now = Date.now();
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const batch = db.batch();

  const teams = teamsSnapshot.docs.map((doc) => {
    const team = doc.data() as Team;

    // Use Zod to parse and validate lastFetched
    const lastFetchedResult = dateOrTimestampSchema.safeParse(team.lastFetched);

    let lastFetchedDate: Date | null = null;
    if (lastFetchedResult.success) {
      if (lastFetchedResult.data instanceof Date) {
        lastFetchedDate = lastFetchedResult.data;
      } else if (lastFetchedResult.data instanceof Timestamp) {
        lastFetchedDate = lastFetchedResult.data.toDate();
      }
    }

    if (lastFetchedDate == null || lastFetchedDate < tenMinutesAgo) {
      batch.update(doc.ref, { lastFetched: now });
    }

    return {
      ...team,
      id: doc.id,
    };
  });

  // Update lastFetched in the DB, but don't wait for it to finish so we can return the teams immediately
  commitBatchAsync(batch);

  return teams;
}

function commitBatchAsync(batch: FirebaseFirestore.WriteBatch): void {
  batch.commit().catch((error) => {
    console.error("Error committing batch update for team lastFetched:", error);
  });
}

function getMostRecentKeyTime(): Date | null {
  const keyTimes = [
    { day: 1, time: "07:00" }, // Monday
    { day: 1, time: "14:00" },
    { day: 1, time: "19:00" },
    { day: 1, time: "23:00" },
    { day: 2, time: "07:00" }, // Tuesday
    { day: 2, time: "17:00" },
    { day: 3, time: "07:00" }, // Wednesday
    { day: 4, time: "07:00" }, // Thursday
    { day: 4, time: "14:00" },
    { day: 4, time: "19:00" },
    { day: 4, time: "23:00" },
    { day: 5, time: "00:00" }, // Friday
    { day: 5, time: "01:00" },
    { day: 5, time: "02:00" },
    { day: 6, time: "07:00" }, // Saturday
    { day: 6, time: "14:00" },
    { day: 6, time: "23:00" },
    { day: 0, time: "07:00" }, // Sunday
    { day: 0, time: "10:00" },
    { day: 0, time: "13:00" },
    { day: 0, time: "14:00" },
    { day: 0, time: "15:00" },
    { day: 0, time: "16:00" },
    { day: 0, time: "17:00" },
    { day: 0, time: "18:00" },
    { day: 0, time: "19:00" },
    { day: 0, time: "20:00" },
    { day: 0, time: "21:00" },
    { day: 0, time: "22:00" },
    { day: 0, time: "23:00" },
  ];

  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();

  let mostRecentKeyTime: Date | null = null;

  // First, check for key times on the current day
  for (const { time } of keyTimes.filter((kt) => kt.day === currentDay)) {
    const [hours, minutes] = time.split(":").map(Number);
    const keyTimeInMinutes = hours * 60 + minutes;

    if (keyTimeInMinutes <= currentTime) {
      const keyTimeDate = new Date(now);
      keyTimeDate.setUTCHours(hours, minutes, 0, 0);
      if (!mostRecentKeyTime || keyTimeDate > mostRecentKeyTime) {
        mostRecentKeyTime = keyTimeDate;
      }
    }
  }

  // If no key time found today, check previous days
  if (!mostRecentKeyTime) {
    for (let i = 1; i <= 7; i++) {
      const previousDay = (currentDay - i + 7) % 7;
      const previousDayKeyTimes = keyTimes.filter(
        (kt) => kt.day === previousDay,
      );

      if (previousDayKeyTimes.length > 0) {
        const lastKeyTime = previousDayKeyTimes[previousDayKeyTimes.length - 1];
        const [hours, minutes] = lastKeyTime.time.split(":").map(Number);
        mostRecentKeyTime = new Date(now);
        mostRecentKeyTime.setUTCDate(now.getUTCDate() - i);
        mostRecentKeyTime.setUTCHours(hours, minutes, 0, 0);
      }
    }
  }

  return mostRecentKeyTime;
}
