import { getDb } from "../firebase";
import type { LeagueMaster, League } from "../types/shared";

export class LeagueMasterService {
  /**
   * Find or create a LeagueMaster for a given platform and external league ID
   */
  static async findOrCreateLeagueMaster({
    name,
    platform,
    externalLeagueId, 
    createdBy,
  }: {
    name: string;
    platform: { name: "sleeper" | "fleaflicker"; id: string };
    externalLeagueId: string;
    createdBy: string;
  }): Promise<LeagueMaster> {
    const db = await getDb();
    
    // Try to find existing LeagueMaster
    const existingQuery = await db
      .collection("leagueMasters")
      .where("platform.name", "==", platform.name)
      .where("externalLeagueId", "==", externalLeagueId)
      .limit(1)
      .get();

      // If we found the league master, return it
    if (!existingQuery.empty) {
      const existingDoc = existingQuery.docs[0];
      const existingLeagueMaster = existingDoc.data() as LeagueMaster;
      
      return {
        ...existingLeagueMaster,
        id: existingDoc.id,
      };
    }

    // Create new LeagueMaster
    const leagueMaster: LeagueMaster = {
      name,
      platform,
      createdBy,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    const newDoc = await db.collection("leagueMasters").add(leagueMaster);
    
    return {
      ...leagueMaster,
      id: newDoc.id,
    };
  }

  /**
   * Get all seasons for a LeagueMaster
   */
  static async getLeagueSeasons(leagueMasterId: string): Promise<League[]> {
    const db = await getDb();
    
    const leaguesSnapshot = await db
      .collection("leagues")
      .where("leagueMasterId", "==", leagueMasterId)
      .orderBy("season", "desc")
      .get();

    return leaguesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as League[];
  }

  /**
   * Get LeagueMaster by ID
   */
  static async getLeagueMaster(leagueMasterId: string): Promise<LeagueMaster | null> {
    const db = await getDb();
    
    const doc = await db.collection("leagueMasters").doc(leagueMasterId).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      ...doc.data(),
      id: doc.id,
    } as LeagueMaster;
  }

  /**
   * Get all LeagueMasters for a user
   */
  static async getUserLeagueMasters(userId: string): Promise<LeagueMaster[]> {
    const db = await getDb();
    
    // Get user's teams to find their LeagueMasters
    const userTeamsSnapshot = await db
      .collection("userTeams")
      .where("userId", "==", userId)
      .get();

    const leagueMasterIds = [...new Set(
      userTeamsSnapshot.docs.map(doc => doc.data().leagueMasterId)
    )];

    if (leagueMasterIds.length === 0) {
      return [];
    }

    // Get LeagueMaster documents
    const leagueMastersSnapshot = await db
      .collection("leagueMasters")
      .where("id", "in", leagueMasterIds)
      .get();

    return leagueMastersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as LeagueMaster[];
  }
}
