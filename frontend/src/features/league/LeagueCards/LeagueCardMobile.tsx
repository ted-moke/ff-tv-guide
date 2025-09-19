import React from "react";
import styles from "./LeagueCardMobile.module.css";
import { LeagueCardData } from "../useLeagueCards";
import { LeagueCardHeader } from "./LeagueCardHeader";
import { LeagueCardExpanded } from "./LeagueCardExpanded";

interface LeagueCardMobileProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
  selectedTeamId: string | null;
}

export const LeagueCardMobile: React.FC<LeagueCardMobileProps> = ({
  selectedTeamId,
  cardData,
  onToggleExpansion,
  hasWeekStarted,
}) => {
  const { team, winning, losing } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id || "");
  };

  const wins = team.stats.wins || 0;
  const losses = team.stats.losses || 0;
  const ties = team.stats.ties || 0;
  const totalGames = wins + losses + ties;
  // const pointsFor = team.stats.pointsFor || 0;
  // const pointsAgainst = team.stats.pointsAgainst || 0;
  // const averagePointsFor = team.stats.averagePointsFor || 0;
  const winPercentage = totalGames > 0 ? wins / totalGames : 0;
  const opponent = cardData.opponent;

  const recordStr = `${wins}-${losses}${ties ? `-${ties}` : ""}`;

  const winPctEval =
    winPercentage > 0.5
      ? "winPercentageGood"
      : winPercentage < 0.5
      ? "winPercentageBad"
      : "winPercentageNeutral";

  const winningEval = winning ? "winning" : losing ? "losing" : "tied";

  const isSelected = selectedTeamId === team.id;
  const otherSelected = selectedTeamId !== team.id && selectedTeamId !== null;
  return (
    <div
      className={`${styles.leagueCard} ${isSelected ? styles.expanded : ""} ${
        otherSelected ? styles.otherSelected : ""
      } ${styles[winningEval]} ${styles[winPctEval]}`}
      id={`league-${team.id}`}
    >
      <div
        className={styles.leagueCardHeader}
        role="button"
        onClick={handleCardClick}
        aria-expanded={isSelected}
      >
        <LeagueCardHeader
          hasWeekStarted={hasWeekStarted}
          isCollapsed={isSelected}
          team={team}
          opponent={opponent}
          recordStr={recordStr}
          winPctEval={winPctEval}
          winningEval={winningEval}
        />
      </div>
      {isSelected && (
        <>
          <hr className={styles.divider} />
          <LeagueCardExpanded team={team} opponent={opponent} />
          {/* <div className={styles.expandedContent}>
            <div className={styles.expandedStats}>
              <div className={`${styles.statItem} ${styles.recordItem}`}>
                <span className={styles.statLabel}>Record</span>
                <span className={styles.statValue}>{recordStr}</span>
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
              </div> */}
              {/* <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Points</span>
                <span className={styles.statValue}>
                  {team.stats.averagePointsFor?.toFixed(1) || "0.0"}
                </span>
              </div> */}
            {/* </div> */}

            {/* <div className={styles.leagueActions}>
              <button className={styles.actionButton}>
                View Details
              </button>
              <button className={styles.actionButton}>
                League Settings
              </button>
            </div> */}
          {/* </div> */}
        </>
      )}
    </div>
  );
};
