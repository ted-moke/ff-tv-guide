import { getDb } from "../src/firebase";
import type { League, LeagueMaster, Team, UserTeam } from "../src/types/shared";

interface MigrationStats {
  leaguesProcessed: number;
  leagueMastersCreated: number;
  teamsUpdated: number;
  userTeamsUpdated: number;
  errors: string[];
}

interface SingleLeagueMigrationStats {
  leagueProcessed: boolean;
  leagueMasterCreated: boolean;
  leagueMasterId?: string;
  teamsUpdated: number;
  userTeamsUpdated: number;
  errors: string[];
}

export async function migrateToLeagueMaster({ season }: { season: number }): Promise<MigrationStats> {
  const db = await getDb();
  const stats: MigrationStats = {
    leaguesProcessed: 0,
    leagueMastersCreated: 0,
    teamsUpdated: 0,
    userTeamsUpdated: 0,
    errors: [],
  };

  try {
    console.log("Starting migration to LeagueMaster structure...");

    // Step 1: Get all existing leagues
    const leaguesSnapshot = await db.collection("leagues").get();
    console.log(`Found ${leaguesSnapshot.size} leagues to process`);

    // Step 2: Group leagues by platform and externalLeagueId
    const leagueGroups = new Map<string, League[]>();
    
    leaguesSnapshot.docs.forEach((doc) => {
      const league = doc.data() as League;
      const key = `${league.platform.name}-${league.externalLeagueId}`;
      
      if (!leagueGroups.has(key)) {
        leagueGroups.set(key, []);
      }
      leagueGroups.get(key)!.push({ ...league, id: doc.id });
    });

    console.log(`Grouped into ${leagueGroups.size} unique league groups`);

    // Step 3: Create LeagueMaster records
    const leagueMasterMap = new Map<string, string>(); // key -> leagueMasterId
    
    for (const [key, leagues] of leagueGroups) {
      try {
        // Use the first league as the base for LeagueMaster
        const baseLeague = leagues[0];
        
        const leagueMaster: LeagueMaster = {
          name: baseLeague.name,
          platform: baseLeague.platform,
          createdBy: "migration", // TODO: This should be determined from user data
          createdAt: new Date(),
          lastModified: new Date(),
        };

        const leagueMasterRef = await db.collection("leagueMasters").add(leagueMaster);
        leagueMasterMap.set(key, leagueMasterRef.id);
        
        stats.leagueMastersCreated++;
        console.log(`Created LeagueMaster for ${key}: ${leagueMasterRef.id}`);
        
        // Step 4: Update leagues with leagueMasterId and season
        const batch = db.batch();
        
        for (const league of leagues) {
          if (!league.id) {
            throw new Error(`League ${league.name} has no ID`);
          }
          const leagueRef = db.collection("leagues").doc(league.id);
          batch.update(leagueRef, {
            leagueMasterId: leagueMasterRef.id,
            season: season,
            lastModified: new Date(),
          });
          stats.leaguesProcessed++;
        }
        
        await batch.commit();
        
      } catch (error) {
        const errorMsg = `Error processing league group ${key}: ${error}`;
        console.error(errorMsg);
        stats.errors.push(errorMsg);
      }
    }

    // Step 5: Update teams with leagueMasterId and season
    const teamsSnapshot = await db.collection("teams").get();
    console.log(`Found ${teamsSnapshot.size} teams to update`);
    
    const teamBatch = db.batch();
    
    for (const doc of teamsSnapshot.docs) {
      const team = doc.data() as Team;
      
      // Find the corresponding league to get leagueMasterId
      const leagueRef = db.collection("leagues").doc(team.leagueId);
      const leagueDoc = await leagueRef.get();
      
      if (leagueDoc.exists) {
        const league = leagueDoc.data() as League;
        const teamRef = db.collection("teams").doc(doc.id);
        
        teamBatch.update(teamRef, {
          leagueMasterId: league.leagueMasterId,
          season: league.season,
        });
        
        stats.teamsUpdated++;
      } else {
        const errorMsg = `League not found for team ${doc.id}`;
        console.error(errorMsg);
        stats.errors.push(errorMsg);
      }
    }
    
    await teamBatch.commit();

    // Step 6: Update userTeams to use leagueMasterId
    const userTeamsSnapshot = await db.collection("userTeams").get();
    console.log(`Found ${userTeamsSnapshot.size} userTeams to update`);
    
    const userTeamBatch = db.batch();
    
    for (const doc of userTeamsSnapshot.docs) {
      const userTeam = doc.data() as UserTeam;
      
      // Find the corresponding team to get leagueMasterId
      const teamRef = db.collection("teams").doc(userTeam.teamId);
      const teamDoc = await teamRef.get();
      
      if (teamDoc.exists) {
        const team = teamDoc.data() as Team;
        const userTeamRef = db.collection("userTeams").doc(doc.id);
        
        userTeamBatch.update(userTeamRef, {
          leagueMasterId: team.leagueMasterId,
          currentSeason: team.season,
          lastModified: new Date(),
        });
        
        stats.userTeamsUpdated++;
      } else {
        const errorMsg = `Team not found for userTeam ${doc.id}`;
        console.error(errorMsg);
        stats.errors.push(errorMsg);
      }
    }
    
    await userTeamBatch.commit();

    console.log("Migration completed successfully!");
    console.log("Stats:", stats);
    
    return stats;
    
  } catch (error) {
    console.error("Migration failed:", error);
    stats.errors.push(`Migration failed: ${error}`);
    return stats;
  }
}

export async function migrateSingleLeague({ 
  leagueId, 
  season, 
}: { 
  leagueId: string; 
  season: number; 
}): Promise<SingleLeagueMigrationStats> {
  const db = await getDb();
  const stats: SingleLeagueMigrationStats = {
    leagueProcessed: false,
    leagueMasterCreated: false,
    teamsUpdated: 0,
    userTeamsUpdated: 0,
    errors: [],
  };

  try {
    console.log(`Starting single league migration for league ${leagueId} with season ${season}...`);

    // Step 1: Get the specific league
    const leagueDoc = await db.collection("leagues").doc(leagueId).get();
    
    if (!leagueDoc.exists) {
      throw new Error(`League with ID ${leagueId} not found`);
    }

    const league = leagueDoc.data() as League;
    console.log(`Found league: ${league.name} (${league.platform.name})`);

    // Check if league already has leagueMasterId
    if (league.leagueMasterId) {
      throw new Error(`League ${league.name} already has leagueMasterId: ${league.leagueMasterId}`);
    }

    // Step 2: Check if a LeagueMaster already exists for this platform/externalLeagueId
    const existingLeagueMasterQuery = await db
      .collection("leagueMasters")
      .where("platform.name", "==", league.platform.name)
      .where("leagueId", "==", league.id)
      .get();

    let leagueMasterId: string;

    if (!existingLeagueMasterQuery.empty) {
      // Use existing LeagueMaster
      const existingLeagueMaster = existingLeagueMasterQuery.docs[0];
      leagueMasterId = existingLeagueMaster.id;
      stats.leagueMasterCreated = false;
      console.log(`Using existing LeagueMaster: ${leagueMasterId}`);
    } else {
      // Create new LeagueMaster
      const leagueMaster: LeagueMaster = {
        name: league.name,
        platform: league.platform,
        createdBy: "migration",
        createdAt: new Date(),
        lastModified: new Date(),
      };

      const leagueMasterRef = await db.collection("leagueMasters").add(leagueMaster);
      leagueMasterId = leagueMasterRef.id;
      stats.leagueMasterCreated = true;
      stats.leagueMasterId = leagueMasterId;
      console.log(`Created new LeagueMaster: ${leagueMasterId}`);
    }

    // Step 3: Update the league with leagueMasterId and season
    const result = await db.collection("leagues").doc(leagueId).update({
      leagueMasterId: leagueMasterId,
      season: season,
      lastModified: new Date(),
    });
    console.log('result', result);
    stats.leagueProcessed = true;
    console.log(`Updated league ${leagueId} with leagueMasterId: ${leagueMasterId}`);

    // Step 4: Update teams for this league
    const teamsSnapshot = await db
      .collection("teams")
      .where("leagueId", "==", leagueId)
      .get();
    
    console.log(`Found ${teamsSnapshot.size} teams for league ${leagueId}`);

    if (teamsSnapshot.size > 0) {
      const teamBatch = db.batch();
      
      for (const doc of teamsSnapshot.docs) {
        const team = doc.data() as Team;
        const teamRef = db.collection("teams").doc(doc.id);
        
        teamBatch.update(teamRef, {
          leagueMasterId: leagueMasterId,
          season: season,
        });
        stats.teamsUpdated++;
      }
      
      await teamBatch.commit();
      console.log(`Updated ${stats.teamsUpdated} teams`);
    }

    // Step 5: Update userTeams that reference teams from this league
    const teamIds = teamsSnapshot.docs.map(doc => doc.id);
    
    if (teamIds.length > 0) {
      const userTeamsSnapshot = await db
        .collection("userTeams")
        .where("teamId", "in", teamIds)
        .get();
      
      console.log(`Found ${userTeamsSnapshot.size} userTeams for teams in league ${leagueId}`);

      if (userTeamsSnapshot.size > 0) {
        const userTeamBatch = db.batch();
        
        for (const doc of userTeamsSnapshot.docs) {
          const userTeam = doc.data() as UserTeam;
          const userTeamRef = db.collection("userTeams").doc(doc.id);
          
          userTeamBatch.update(userTeamRef, {
            leagueMasterId: leagueMasterId,
            currentSeason: season,
          });
          stats.userTeamsUpdated++;
        }
        
        await userTeamBatch.commit();
        console.log(`Updated ${stats.userTeamsUpdated} userTeams`);
      }
    }

    console.log("Single league migration completed successfully!");
    console.log("Stats:", stats);
    
    return stats;
    
  } catch (error) {
    console.error("Single league migration failed:", error);
    stats.errors.push(`Migration failed: ${error}`);
    return stats;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToLeagueMaster({ season: 2025 })
    .then((stats) => {
      console.log("Migration completed with stats:", stats);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
