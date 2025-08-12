import { getDb } from "../src/firebase";
import type { League, LeagueMaster, Team, UserTeam } from "../src/types/shared";

interface MigrationStats {
  leaguesProcessed: number;
  leagueMastersCreated: number;
  teamsUpdated: number;
  userTeamsUpdated: number;
  errors: string[];
}

export async function migrateToLeagueMaster(): Promise<MigrationStats> {
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
        
        // Determine season - default to 2024 for existing data
        const season = 2024; // TODO: This should be detected from data or user input
        
        const leagueMaster: LeagueMaster = {
          name: baseLeague.name,
          platform: baseLeague.platform,
          externalLeagueId: baseLeague.externalLeagueId,
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

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToLeagueMaster()
    .then((stats) => {
      console.log("Migration completed with stats:", stats);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
