import { getDb } from "../src/firebase";

async function listLeagues() {
  const db = await getDb();
  
  try {
    console.log("Fetching all leagues...\n");
    
    const leaguesSnapshot = await db.collection("leagues").orderBy("lastModified", "desc").limit(100).get();
    
    if (leaguesSnapshot.empty) {
      console.log("No leagues found in the database.");
      return;
    }
    
    console.log(`Found ${leaguesSnapshot.size} leagues:\n`);
    console.log("ID".padEnd(30) + "Name".padEnd(40) + "Platform".padEnd(15) + "Has LeagueMasterId");
    console.log("-".repeat(100));
    
    leaguesSnapshot.docs.forEach((doc) => {
      const league = doc.data();
      const hasLeagueMasterId = league.leagueMasterId ? "Yes" : "No";
      
      console.log(
        doc.id.padEnd(30) + 
        (league.name || "N/A").substring(0, 39).padEnd(40) + 
        (league.platform?.name || "N/A").padEnd(15) + 
        hasLeagueMasterId
      );
    });
    
    console.log("\n" + "-".repeat(100));
    console.log(`Total: ${leaguesSnapshot.size} leagues`);
    
    const migratedCount = leaguesSnapshot.docs.filter(doc => doc.data().leagueMasterId).length;
    const notMigrated = leaguesSnapshot.docs.filter(doc => !doc.data().leagueMasterId);

    
    console.log(`Migrated: ${migratedCount} leagues`);
    console.log(`Not migrated: ${notMigrated.length} leagues`);
    console.log(`Top few not migrated: ${notMigrated.slice(0, 5).map(doc => doc.data().league_id)}`);
    
  } catch (error) {
    console.error("Error listing leagues:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  listLeagues()
    .then(() => {
      console.log("\nDone!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to list leagues:", error);
      process.exit(1);
    });
}
