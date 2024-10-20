import { Request, Response } from "express";
import { getDb } from "../firebase";
import { Team } from "../models/team";

export const getUserTeams = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const teams = await getTeamsForUser(uid);
    const mostRecentKeyTime = getMostRecentKeyTime();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Augment each team with the 'needsUpdate' parameter
    const augmentedTeams = teams.map((team) => ({
      ...team,
      needsUpdate:
        team.lastFetched == null ||
        team.lastFetched < mostRecentKeyTime ||
        team.lastFetched < tenMinutesAgo,
    }));

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

async function getTeamsForUser(userId: string): Promise<Team[]> {
  const db = await getDb();
  const userTeamsSnapshot = await db
    .collection("userTeams")
    .where("userId", "==", userId)
    .get();

  const teamIds = userTeamsSnapshot.docs.map((doc) => doc.data().teamId);

  if (teamIds.length === 0) {
    return [];
  }

  const teamsSnapshot = await db
    .collection("teams")
    .where("id", "in", teamIds)
    .get();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const batch = db.batch();

  const teams = teamsSnapshot.docs.map((doc) => {
    const team = doc.data() as Team;
    if (team.lastFetched < twentyFourHoursAgo) {
      batch.update(doc.ref, { lastFetched: now });
    }
    return {
      ...team,
      id: doc.id,
    };
  });

  await batch.commit();

  return teams;
}

function getMostRecentKeyTime(): Date {
  const keyTimes = [
    { day: 1, time: "07:00" }, // Monday
    { day: 1, time: "14:00" },
    { day: 1, time: "19:00" },
    { day: 1, time: "23:00" },
    { day: 2, time: "07:00" }, // Tuesday
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

  for (const { day, time } of keyTimes) {
    const [hours, minutes] = time.split(":").map(Number);
    const keyTimeInMinutes = hours * 60 + minutes;

    const keyTimeDate = new Date(now);
    keyTimeDate.setUTCDate(now.getUTCDate() - ((currentDay - day + 7) % 7));
    keyTimeDate.setUTCHours(hours, minutes, 0, 0);

    if (
      (day < currentDay ||
        (day === currentDay && keyTimeInMinutes <= currentTime)) &&
      (!mostRecentKeyTime || keyTimeDate > mostRecentKeyTime)
    ) {
      mostRecentKeyTime = keyTimeDate;
    }
  }

  return mostRecentKeyTime || new Date();
}
