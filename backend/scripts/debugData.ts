import { getDb } from "../src/firebase";

async function debugData() {
  const db = await getDb();
  
  console.log("=== Debugging Data Structure ===");
  
  // Check userTeams
  const userTeamsSnapshot = await db.collection("userTeams").get();
  console.log(`Found ${userTeamsSnapshot.size} userTeams`);
  
  if (userTeamsSnapshot.size > 0) {
    const firstUserTeam = userTeamsSnapshot.docs[0];
    console.log("First userTeam data:", firstUserTeam.data());
    console.log("First userTeam ID:", firstUserTeam.id);
  }
  
  // Check leagueMasters
  const leagueMastersSnapshot = await db.collection("leagueMasters").get();
  console.log(`Found ${leagueMastersSnapshot.size} leagueMasters`);
  
  if (leagueMastersSnapshot.size > 0) {
    const firstLeagueMaster = leagueMastersSnapshot.docs[0];
    console.log("First leagueMaster data:", firstLeagueMaster.data());
    console.log("First leagueMaster ID:", firstLeagueMaster.id);
  }
  
  // Check leagues
  const leaguesSnapshot = await db.collection("leagues").get();
  console.log(`Found ${leaguesSnapshot.size} leagues`);
  
  if (leaguesSnapshot.size > 0) {
    const firstLeague = leaguesSnapshot.docs[0];
    console.log("First league data:", firstLeague.data());
    console.log("First league ID:", firstLeague.id);
  }
  
  // Check teams
  const teamsSnapshot = await db.collection("teams").get();
  console.log(`Found ${teamsSnapshot.size} teams`);
  
  if (teamsSnapshot.size > 0) {
    const firstTeam = teamsSnapshot.docs[0];
    console.log("First team data:", firstTeam.data());
    console.log("First team ID:", firstTeam.id);
  }
}

if (require.main === module) {
  debugData()
    .then(() => {
      console.log("Debug completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Debug failed:", error);
      process.exit(1);
    });
}
