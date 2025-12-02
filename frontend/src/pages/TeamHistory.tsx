import React from "react";
import { useTeamHistory } from "../features/teams/useTeamHistory";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import styles from "./TeamHistory.module.css";
import { LeagueHistoryCard } from "../features/teams/LeagueHistoryCard";
import { Navigate } from "react-router-dom";
import { useNeedsResources } from "../features/teams/useNeedsResources";

const TeamHistory: React.FC = () => {
  const { data: history, groupedByTeam, isLoading, error } = useTeamHistory();
  const { isLoading: needsConnectLoading, needsConnect, needsAccount } = useNeedsResources();

  if (needsConnectLoading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (needsAccount) { 
    console.warn("needsAccount", needsAccount);
    return <Navigate to="/connect-team" />;
  }

  if (needsConnect) {
    console.warn("needsConnect", needsConnect);
    return <Navigate to="/connect-team" />;
  }

  if (isLoading) {
    return (
      <div className={`${styles.container} page-container`}>
        <div className={styles.loading}>
          <LoadingSpinner text="Loading team history..." />
          <span style={{ marginLeft: "1rem" }}>Loading team history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} page-container`}>
        <div className={styles.error}>
          Error loading team history: {error.message}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className={`${styles.container} page-container`}>
        <h1 className={styles.title}>Team History</h1>
        <div className={styles.empty}>
          No team history found. Connect some leagues to see your performance across seasons!
        </div>
      </div>
    );
  }

  const leagueGroups = Object.values(groupedByTeam);

  return (
    <div className={`${styles.container} page-container`}>
      <h1 className={styles.title}>Team History</h1>
      
      {leagueGroups.map((leagueData) => (
        <LeagueHistoryCard key={leagueData[0].leagueMaster.id} leagueData={leagueData} />
      ))}
    </div>
  );
};

export default TeamHistory;
