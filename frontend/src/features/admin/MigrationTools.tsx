import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runMigration, seedTestData } from "./adminAPI";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import styles from "./MigrationTools.module.css";

const MigrationTools: React.FC = () => {
  const [migrationSeason, setMigrationSeason] = useState("2025");

  const migrationMutation = useMutation({
    mutationFn: (season: number) => runMigration(season),
    onSuccess: (data) => {
      console.log("Migration completed successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to run migration:", error);
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
            onClick={handleRunMigration} 
            disabled={migrationMutation.isPending}
            color="danger"
          >
            {migrationMutation.isPending ? "Running Migration..." : "Run Migration"}
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
      
      {migrationMutation.isError && (
        <div className={styles.error}>
          Error running migration: {(migrationMutation.error as Error).message}
        </div>
      )}
      {migrationMutation.isSuccess && (
        <div className={styles.success}>
          Migration completed successfully!
          {migrationMutation.data?.stats && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <strong>Stats:</strong> {JSON.stringify(migrationMutation.data.stats, null, 2)}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.migrationInfo}>
        <p><strong>Seed Test Data:</strong> Creates test leagues, teams, and user teams for testing the migration.</p>
        <p><strong>Run Migration:</strong> Executes the LeagueMaster migration with the specified season.</p>
      </div>
    </div>
  );
};

export default MigrationTools;
