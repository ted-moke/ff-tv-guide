import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runMigration, runSingleLeagueMigration, seedTestData } from "./adminAPI";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import styles from "./MigrationTools.module.css";

const MigrationTools: React.FC = () => {
  const [migrationSeason, setMigrationSeason] = useState("2025");
  const [singleLeagueId, setSingleLeagueId] = useState("");

  const migrationMutation = useMutation({
    mutationFn: (season: number) => runMigration(season),
    onSuccess: (data) => {
      console.log("Migration completed successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to run migration:", error);
    },
  });

  const singleLeagueMigrationMutation = useMutation({
    mutationFn: ({ leagueId, season }: { leagueId: string; season: number }) => 
      runSingleLeagueMigration(leagueId, season),
    onSuccess: (data) => {
      console.log("Single league migration completed successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to run single league migration:", error);
    },
  });

  const seedTestDataMutation = useMutation({
    mutationFn: seedTestData,
    onSuccess: () => {
      console.log("Test data seeded successfully!");
    },
    onError: (error) => {
      console.error("Failed to seed test data:", error);
    },
  });

  const handleRunMigration = () => {
    const season = parseInt(migrationSeason, 10);
    if (isNaN(season)) {
      alert("Please enter a valid season number");
      return;
    }
    migrationMutation.mutate(season);
  };

  const handleRunSingleLeagueMigration = () => {
    const season = parseInt(migrationSeason, 10);
    if (isNaN(season)) {
      alert("Please enter a valid season number");
      return;
    }
    if (!singleLeagueId.trim()) {
      alert("Please enter a league ID");
      return;
    }
    singleLeagueMigrationMutation.mutate({ leagueId: singleLeagueId.trim(), season });
  };

  const handleSeedTestData = () => {
    seedTestDataMutation.mutate();
  };

  return (
    <div className={styles.migrationSection}>
      <h3>Migration Tools</h3>
      <div className={styles.migrationControls}>
        <div className={styles.migrationInput}>
          <label htmlFor="migration-season">Season:</label>
          <TextInput
            id="migration-season"
            type="number"
            value={migrationSeason}
            onChange={(e) => setMigrationSeason(e.target.value)}
            placeholder="2025"
          />
        </div>
        <div className={styles.migrationInput}>
          <label htmlFor="single-league-id">League ID (for single league migration):</label>
          <TextInput
            id="single-league-id"
            type="text"
            value={singleLeagueId}
            onChange={(e) => setSingleLeagueId(e.target.value)}
            placeholder="Enter league ID"
          />
        </div>
        <div className={styles.migrationButtons}>
          <Button 
            onClick={handleSeedTestData} 
            disabled={seedTestDataMutation.isPending}
            color="primary"
            outline
          >
            {seedTestDataMutation.isPending ? "Seeding..." : "Seed Test Data"}
          </Button>
          <Button 
            onClick={handleRunSingleLeagueMigration} 
            disabled={singleLeagueMigrationMutation.isPending}
            color="primary"
          >
            {singleLeagueMigrationMutation.isPending ? "Migrating League..." : "Migrate Single League"}
          </Button>
          <Button 
            onClick={handleRunMigration} 
            disabled={migrationMutation.isPending}
            color="danger"
          >
            {migrationMutation.isPending ? "Running Migration..." : "Run Full Migration"}
          </Button>
        </div>
      </div>
      
      {/* Error and Success States */}
      {seedTestDataMutation.isError && (
        <div className={styles.error}>
          Error seeding test data: {(seedTestDataMutation.error as Error).message}
        </div>
      )}
      {seedTestDataMutation.isSuccess && (
        <div className={styles.success}>Test data seeded successfully.</div>
      )}
      
      {singleLeagueMigrationMutation.isError && (
        <div className={styles.error}>
          Error running single league migration: {(singleLeagueMigrationMutation.error as Error).message}
        </div>
      )}
      {singleLeagueMigrationMutation.isSuccess && (
        <div className={styles.success}>
          Single league migration completed successfully!
          {singleLeagueMigrationMutation.data?.stats && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <strong>Stats:</strong> {JSON.stringify(singleLeagueMigrationMutation.data.stats, null, 2)}
            </div>
          )}
        </div>
      )}
      
      {migrationMutation.isError && (
        <div className={styles.error}>
          Error running full migration: {(migrationMutation.error as Error).message}
        </div>
      )}
      {migrationMutation.isSuccess && (
        <div className={styles.success}>
          Full migration completed successfully!
          {migrationMutation.data?.stats && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <strong>Stats:</strong> {JSON.stringify(migrationMutation.data.stats, null, 2)}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.migrationInfo}>
        <p><strong>Seed Test Data:</strong> Creates test leagues, teams, and user teams for testing the migration.</p>
        <p><strong>Migrate Single League:</strong> Migrates a single league and its associated teams/user teams. Use this for testing or incremental migration.</p>
        <p><strong>Run Full Migration:</strong> Executes the LeagueMaster migration for ALL leagues with the specified season.</p>
      </div>
    </div>
  );
};

export default MigrationTools;
