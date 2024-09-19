import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getLeagueStats, updateAllLeagues } from "../features/league/leagueAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LeagueList from "../features/league/LeagueList";
import styles from "./AdminLeagues.module.css";
import Button from "../components/ui/Button";

const callsPerPlatformSync = {
  sleeper: 2,
  fleaflicker: 14,
};

const AdminLeagues: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leagueStats"],
    queryFn: getLeagueStats,
  });

  const mutation = useMutation({
    mutationFn: updateAllLeagues,
    onSuccess: () => {
      alert("All leagues updated successfully");
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
    mutation.mutate();
  };

  return (
    <div className={styles.adminLeagues}>
      <div className={styles.header}>
        <h2>Leagues</h2>
        <Button onClick={handleUpdateAllLeagues} disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update All Leagues"}
        </Button>
      </div>
      <div className={styles.stats}>
        <h2>League Statistics</h2>
        <p>Total Leagues: {data.totalLeagues}</p>
        <div className={styles.platformCounts}>
          {Object.entries(data.platformCounts).map(([platform, count]) => (
            <div key={platform}>
              <p>
                {platform}: {count}
              </p>
              <p>
                Syncing all would result in{" "}
                {callsPerPlatformSync[
                  platform as keyof typeof callsPerPlatformSync
                ] * count}{" "}
                API calls.
              </p>
            </div>
          ))}
        </div>
      </div>
      <LeagueList />
    </div>
  );
};

export default AdminLeagues;
