import React from "react";
import styles from "./LeagueCards.module.css";
import { LeagueCardData } from "./useLeagueCards";

interface LeagueCardMobileProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
}

export const LeagueCardMobile: React.FC<LeagueCardMobileProps> = ({
  cardData,
  onToggleExpansion,
}) => {
  const { team, isExpanded, winning, losing } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id || "");
  };

  return (
    <div
      className={`${styles.leagueCard} ${isExpanded ? styles.expanded : ""} ${
        winning ? styles.winning : losing ? styles.losing : styles.tied
      }`}
      id={`league-${team.id}`}
    >
      <div
        className={styles.leagueCardHeader}
        role="button"
        onClick={handleCardClick}
        aria-expanded={isExpanded}
      >
        <div className={styles.leagueCardContent}>
          <div className={styles.leagueCardTop}>
            <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
            <h3 className={styles.leagueRecord}>
              {team.stats.wins || 0}-{team.stats.losses || 0}
              {team.stats.ties ? `-${team.stats.ties}` : ""}
            </h3>
          </div>
          <div className={styles.leagueCardBottom}>
            <p className={styles.weekPoints}>
              {team.weekPoints?.toFixed(1) || "0.0"}
            </p>
            <span className={styles.weekPointsSeparator}>v</span>
            <p className={styles.weekPointsAgainst}>
              {team.weekPointsAgainst?.toFixed(1) || "0.0"}
            </p>
          </div>
        </div>
      </div>
      {isExpanded && (
        <>
          <hr className={styles.divider} />
          <div className={styles.expandedContent}>
            <div className={styles.expandedStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Record</span>
                <span className={styles.statValue}>
                  {team.stats.wins || 0}-{team.stats.losses || 0}
                  {team.stats.ties ? `-${team.stats.ties}` : ""}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points For</span>
                <span className={styles.statValue}>
                  {team.stats.pointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points Against</span>
                <span className={styles.statValue}>
                  {team.stats.pointsAgainst?.toFixed(1) || "0.0"}
                </span>
              </div>
              {/* <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Points</span>
                <span className={styles.statValue}>
                  {team.stats.averagePointsFor?.toFixed(1) || "0.0"}
                </span>
              </div> */}
            </div>

            {/* <div className={styles.leagueActions}>
              <button className={styles.actionButton}>
                View Details
              </button>
              <button className={styles.actionButton}>
                League Settings
              </button>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};
