import { Timestamp } from "firebase-admin/firestore";
import { getMostRecentKeyTime } from "../utils/getKeyTimes";
import { getDb } from "../firebase";
import { Team } from "../models/team";
import { z } from "zod";
import { getCurrentSeason } from "../utils/getCurrentSeason";

// const TIME_TO_TEAM_STALE = 120 * 60 * 1000; // 2 hours
const TIME_TO_TEAM_STALE = 4 * 60 * 1000; // 4 minutes

// Define Zod schemas for Date and Timestamp
const dateSchema = z.instanceof(Date);
const timestampSchema = z.instanceof(Timestamp);

// Combined schema that accepts either Date or Timestamp
const dateOrTimestampSchema = z.union([dateSchema, timestampSchema]);

export const fetchUserTeamsWithNeedsUpdate = async (
  uid: string,
  seasonStart: string,
  seasonEnd: string | null,
): Promise<{ teams: Team[]; seasonsPresent: number[] }> => {
  try {
    const teams = await getTeamsForUser(uid, seasonStart, seasonEnd);
    const mostRecentKeyTime = getMostRecentKeyTime();
    const staleTime = new Date(Date.now() - TIME_TO_TEAM_STALE);
    const currentSeason = getCurrentSeason();

    console.log("teams", teams.length);

    // Augment each team with the 'needsUpdate' parameter
    const augmentedTeams = teams.map((team) => {
      const lastFetchedDate =
        team.lastFetched instanceof Timestamp
          ? team.lastFetched.toDate()
          : team.lastFetched instanceof Date
            ? team.lastFetched
            : null;

      let needsUpdate = false;
      if (
        team.season === currentSeason &&
        (lastFetchedDate == null ||
          mostRecentKeyTime == null ||
          lastFetchedDate < mostRecentKeyTime ||
          lastFetchedDate < staleTime)
      ) {
        needsUpdate = true;
      }

      return {
        ...team,
        needsUpdate,
      } as Team;
    });

    console.log("augmentedTeams", augmentedTeams.length);

    // get all unique seasons present in the teams
    const seasonsPresent = [
      ...new Set(augmentedTeams.map((team) => team.season)),
    ];

    console.log("seasonsPresent", seasonsPresent);

    return { teams: augmentedTeams, seasonsPresent };
  } catch (error) {
    console.error("Error fetching user teams:", error);
    throw error;
  }
};

export async function getTeamsForUser(
  userId: string,
  seasonStart: string,
  seasonEnd: string | null,
): Promise<Team[]> {
  console.log("Getting teams for user", userId);
  const db = await getDb();

  const seasonStartNumber = parseInt(seasonStart);
  const seasonEndNumber = seasonEnd ? parseInt(seasonEnd) : null;

  const userTeamsSnapshot = await db.collection("userTeams").where("userId", "==", userId).get();

  const teamIds = userTeamsSnapshot.docs.map((doc) => doc.data().teamId);

  if (teamIds.length === 0) {
    console.log("No teams found for user", userId);
    return [];
  }

  let teamsQuery = db
    .collection("teams")
    .where("id", "in", teamIds)
    .where("season", ">=", seasonStartNumber);

  if (seasonEndNumber) {
    teamsQuery = teamsQuery.where("season", "<=", seasonEndNumber);
  }

  const teamsSnapshot = await teamsQuery.get();

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

  console.log("returning teams", teams.length);
  return teams;
}

function commitBatchAsync(batch: FirebaseFirestore.WriteBatch): void {
  batch.commit().catch((error) => {
    console.error("Error committing batch update for team lastFetched:", error);
  });
}
