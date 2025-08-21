import React from "react";
import { useTeamHistory } from "../features/teams/useTeamHistory";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import styles from "./TeamHistory.module.css";

const TeamHistory: React.FC = () => {
  const { data: history, isLoading, error } = useTeamHistory();

  if (isLoading) {
    return (
      <div className={`${styles.container} page-container`}>
        <div className={styles.loading}>
          <LoadingSpinner />
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

  return (
    <div className={`${styles.container} page-container`}>
      <h1 className={styles.title}>Team History</h1>
      
      {history.map((leagueData) => (
        <div key={leagueData.leagueMaster.id} className={styles.leagueCard}>
          <div className={styles.leagueHeader}>
            <h2 className={styles.leagueName}>{leagueData.leagueMaster.name}</h2>
            <span className={styles.platformBadge}>
              {leagueData.leagueMaster.platform.name}
            </span>
          </div>
          
          <div className={styles.seasonsGrid}>
            {leagueData.seasons.map((seasonData) => (
              <div key={`${leagueData.leagueMaster.id}-${seasonData.season}`} className={styles.seasonCard}>
                <div className={styles.seasonHeader}>
                  <span className={styles.seasonYear}>{seasonData.season}</span>
                </div>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Record</span>
                    <div className={`${styles.record} ${styles.statValueLarge}`}>
                      <span className={styles.wins}>{seasonData.stats.wins}W</span>
                      <span className={styles.losses}>{seasonData.stats.losses}L</span>
                      {seasonData.stats.ties > 0 && (
                        <span className={styles.ties}>{seasonData.stats.ties}T</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Win %</span>
                    <span className={`${styles.statValue} ${styles.statValueLarge} ${(() => {
                      const winPercentage = seasonData.stats.wins + seasonData.stats.losses + seasonData.stats.ties > 0
                        ? (seasonData.stats.wins / (seasonData.stats.wins + seasonData.stats.losses + seasonData.stats.ties)) * 100
                        : 0;
                      if (winPercentage > 50) return styles.winPercentageGood;
                      if (winPercentage < 50) return styles.winPercentageBad;
                      return styles.winPercentageNeutral;
                    })()}`}>
                      {seasonData.stats.wins + seasonData.stats.losses + seasonData.stats.ties > 0
                        ? ((seasonData.stats.wins / (seasonData.stats.wins + seasonData.stats.losses + seasonData.stats.ties)) * 100).toFixed(1)
                        : "0.0"}%
                    </span>
                  </div>
                  
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Points For</span>
                    <span className={styles.statValue}>
                      {seasonData.stats.pointsFor.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Points Against</span>
                    <span className={styles.statValue}>
                      {seasonData.stats.pointsAgainst.toFixed(1)}
                    </span>
                  </div>
                  
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamHistory;
