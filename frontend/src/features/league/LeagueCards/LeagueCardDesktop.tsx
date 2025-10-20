import React from "react";
import styles from "./LeagueCardDesktop.module.css";
import { LeagueCardData } from "../useLeagueCards";
import { LeagueCardHeader } from "./LeagueCardHeader";
import { LeagueCardExpanded } from "./LeagueCardExpanded";

interface LeagueCardDesktopProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
  selectedTeamId: string | null;
}

export const LeagueCardDesktop: React.FC<LeagueCardDesktopProps> = ({
  cardData,
  onToggleExpansion,
  hasWeekStarted,
  selectedTeamId,
}) => {
  const { team, winning, losing } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id || "");
  };

  const wins = team.stats.wins || 0;
  const losses = team.stats.losses || 0;
  const ties = team.stats.ties || 0;
  const totalGames = wins + losses + ties;
  // const averagePointsFor = team.stats.averagePointsFor || 0;
  const opponent = cardData.opponent;

  const winPercentage = totalGames > 0 ? wins / totalGames : 0;
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
      } ${winning ? styles.winning : losing ? styles.losing : styles.tied} ${
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
        aria-expanded={isSelected}
      >
        <LeagueCardHeader
          hasWeekStarted={hasWeekStarted}
          isCollapsed={!isSelected}
          team={team}
          opponent={opponent}
          recordStr={recordStr}
          winPctEval={winPctEval}
          winningEval={winningEval}
        />
      </div>
      {isSelected && <LeagueCardExpanded team={team} opponent={opponent} />}
    </div>
  );
};
