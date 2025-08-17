import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getLeagueStats, updateAllLeagues, runMigration, seedTestData } from "../features/league/leagueAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LeagueList from "../features/league/LeagueList";
import styles from "./AdminLeagues.module.css";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

const callsPerPlatformSync = {
  sleeper: 2,
  fleaflicker: 14,
};

const AdminLeagues: React.FC = () => {
  const [migrationSeason, setMigrationSeason] = useState("2025");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["leagueStats"],
    queryFn: getLeagueStats,
  });

  const updateLeaguesMutation = useMutation({
    mutationFn: updateAllLeagues,
    onSuccess: () => {
      alert("League update started");
    },
    onError: (error) => {
      console.error("Failed to update leagues:", error);
      alert("Failed to update leagues");
    },
  });

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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  if (!data) return <div>No data available</div>;

  const handleUpdateAllLeagues = () => {
    updateLeaguesMutation.mutate();
  };

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
    <div className={styles.adminLeagues}>
      <div className={styles.header}>
        <h2>Leagues</h2>
        <Button onClick={handleUpdateAllLeagues} disabled={updateLeaguesMutation.isPending}>
          {updateLeaguesMutation.isPending ? "Updating..." : "Update All Leagues"}
        </Button>
      </div>
      <div className={styles.stats}>
        <p>Total Leagues: {data.totalLeagues}</p>
        <div className={styles.platformCounts}>
          {Object.entries(data.platformCounts).map(([platform, count]) => (
            <div key={platform}>
              <p>
                {platform}: {count} (Syncing all would result in{" "}
                {callsPerPlatformSync[
                  platform as keyof typeof callsPerPlatformSync
                ] * count}{" "}
                API calls.)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Section */}
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
              color="secondary"
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

      <LeagueList />
    </div>
  );
};

export default AdminLeagues;
