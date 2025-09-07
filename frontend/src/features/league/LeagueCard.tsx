import React from "react";
import styles from "./LeagueCards.module.css";
import { LeagueCardData } from "./useLeagueCards";
import {
  LuChevronDown as ChevronDown,
  LuChevronUp as ChevronUp,
} from "react-icons/lu";
import IconButton from "../../components/IconButton";

interface LeagueCardProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  cardData,
  onToggleExpansion,
}) => {
  const { team, isExpanded, winning, losing, tied } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id);
  };

  return (
    <div
      className={`${styles.leagueCard} ${
        isExpanded ? styles.expanded : ""
      } ${winning ? styles.winning : losing ? styles.losing : styles.tied}`}
      id={`league-${team.id}`}
    >
      <div
        className={styles.leagueCardHeader}
        role="button"
        onClick={handleCardClick}
        aria-expanded={isExpanded}
      >
        <div className={styles.leagueCardContent}>
          <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
          <p className={styles.weekPoints}>
            {team.weekPoints?.toFixed(2) || "0.00"}
          </p>
          <p className={styles.weekPointsAgainst}>
            {team.weekPointsAgainst?.toFixed(2) || "0.00"}
          </p>
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
                  {team.wins || 0}-{team.losses || 0}
                  {team.ties ? `-${team.ties}` : ""}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points For</span>
                <span className={styles.statValue}>
                  {team.pointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points Against</span>
                <span className={styles.statValue}>
                  {team.pointsAgainst?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Points</span>
                <span className={styles.statValue}>
                  {team.averagePointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>

            <div className={styles.leagueActions}>
              <button className={styles.actionButton}>
                View Details
              </button>
              <button className={styles.actionButton}>
                League Settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
