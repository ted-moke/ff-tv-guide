import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getLeagueStats, updateAllLeagues } from "./adminAPI";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import styles from "./LeagueStats.module.css";

const callsPerPlatformSync = {
  sleeper: 2,
  fleaflicker: 14,
};

const LeagueStats: React.FC = () => {
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  const handleUpdateAllLeagues = () => {
    updateLeaguesMutation.mutate();
  };

  return (
    <div className={styles.statsSection}>
      <div className={styles.header}>
        <h2>Leagues</h2>
        <Button 
          onClick={handleUpdateAllLeagues} 
          disabled={updateLeaguesMutation.isPending}
        >
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
    </div>
  );
};

export default LeagueStats;
