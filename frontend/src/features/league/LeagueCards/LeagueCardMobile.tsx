import React from "react";
import styles from "./LeagueCardMobile.module.css";
import { LeagueCardData } from "../useLeagueCards";

interface LeagueCardMobileProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
}

export const LeagueCardMobile: React.FC<LeagueCardMobileProps> = ({
  cardData,
  onToggleExpansion,
  hasWeekStarted,
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
  const averagePointsFor = team.stats.averagePointsFor || 0;
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
        <div className={styles.leagueCardWrapper}>
          {hasWeekStarted ? (
            <div
              className={`${styles.leagueCardContent} ${styles.leagueCardContentWeekStarted}`}
            >
              <div
                className={`${styles.leagueCardTop} ${styles.leagueCardTopWeekStarted}`}
              >
                <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
                <h3 className={styles.leagueRecord}>
                  {wins}-{losses}
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
          ) : (
            <div
              className={`${styles.leagueCardContent} ${styles.leagueCardContentNoWeekStarted}`}
            >
              <div className={styles.leagueCardTop}>
                <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
                <h3 className={styles.leagueRecord}>
                  {wins}-{losses}
                  {team.stats.ties ? `-${team.stats.ties}` : ""}
                </h3>
              </div>
              <div className={styles.leagueCardBottom}>
                <p className={styles.avgPointsLabel}>Avg</p>
                <p className={styles.avgPoints}>
                  {team.stats.averagePointsFor?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <>
          <hr className={styles.divider} />
          <div className={styles.expandedContent}>
            <div className={styles.expandedStats}>
              <div className={`${styles.statItem} ${styles.recordItem}`}>
                <span className={styles.statLabel}>Record</span>
                <span
                  className={styles.statValue}
                >
                  {wins}-{losses}
                  {team.stats.ties ? `-${team.stats.ties}` : ""}
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
