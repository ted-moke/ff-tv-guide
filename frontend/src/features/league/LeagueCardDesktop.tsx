import React from "react";
import styles from "./LeagueCardDesktop.module.css";
import { LeagueCardData } from "./useLeagueCards";

interface LeagueCardDesktopProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
}

export const LeagueCardDesktop: React.FC<LeagueCardDesktopProps> = ({
  cardData,
  onToggleExpansion,
}) => {
  const { team, isExpanded, winning, losing } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id || "");
  };

  const wins = team.stats.wins || 0;
  const losses = team.stats.losses || 0;
  const ties = team.stats.ties || 0;
  const totalGames = wins + losses + ties;
  const pointsFor = team.stats.pointsFor || 0;
  const pointsAgainst = team.stats.pointsAgainst || 0;
  const averagePointsFor = totalGames > 0 ? pointsFor / totalGames : 0;

  const winPercentage = totalGames > 0 ? wins / totalGames : 0;

  return (
    <div
      className={`${styles.leagueCard} ${isExpanded ? styles.expanded : ""} ${
        winning ? styles.winning : losing ? styles.losing : styles.tied
      } ${
        winPercentage > 0.5
          ? styles.winPercentageGood
          : winPercentage < 0.5
          ? styles.winPercentageBad
          : styles.winPercentageNeutral
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
            <div className={styles.leagueCardLeft}>
              <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
              <div className={styles.leagueRecord}>
                {wins}-{losses}
                {ties ? `-${ties}` : ""}
              </div>
            </div>
            <div className={styles.leagueScores}>
              <p className={styles.weekPoints}>
                {team.weekPoints?.toFixed(2) || "0.00"}
              </p>
              <p className={styles.weekPointsAgainst}>
                vs. {team.weekPointsAgainst?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <>
          <hr className={styles.divider} />
          <div className={styles.expandedContent}>
            <div className={styles.expandedStats}>
              <div className={`${styles.statItem} ${styles.recordItem}`}>
                <span className={styles.statLabel}>Record</span>
                <span className={styles.statValue}>
                  {wins}-{losses}
                  {ties ? `-${ties}` : ""}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Pts</span>
                <span className={styles.statValue}>
                  {averagePointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Pts For</span>
                <span className={styles.statValue}>
                  {pointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Pts Against</span>
                <span className={styles.statValue}>
                  {pointsAgainst?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
            {/* 
            <div className={styles.leagueActions}>
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
