#!/usr/bin/env ts-node

import { migrateToLeagueMaster } from "./migrateToLeagueMaster";

async function main() {
  console.log("Starting LeagueMaster migration...");
  
  try {
    const stats = await migrateToLeagueMaster();
    
    console.log("\n=== Migration Summary ===");
    console.log(`Leagues processed: ${stats.leaguesProcessed}`);
    console.log(`LeagueMasters created: ${stats.leagueMastersCreated}`);
    console.log(`Teams updated: ${stats.teamsUpdated}`);
    console.log(`UserTeams updated: ${stats.userTeamsUpdated}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n=== Errors (${stats.errors.length}) ===`);
      stats.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log("\nMigration completed!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
