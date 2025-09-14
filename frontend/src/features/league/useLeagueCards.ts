import { useState, useMemo } from "react";
import { useView } from "../view/ViewContext";
import { FantasyTeam } from "../teams/teamTypes";

export interface LeagueCardData {
  team: FantasyTeam;
  isExpanded: boolean;
  winning: boolean;
  losing: boolean;
  tied: boolean;
  opponent: FantasyTeam | null;
}

export const useLeagueCards = () => {
  const { visibleTeams, visibleOpponentTeams, matchupPlayers } = useView();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const leagueCardsData = useMemo((): LeagueCardData[] => {
    if (!matchupPlayers) {
      return [];
    }

    return Object.values(visibleTeams).map((team) => {
      const winning =
        team.weekPoints != null &&
        team.weekPointsAgainst != null &&
        team.weekPoints > team.weekPointsAgainst;
      const losing =
        team.weekPoints != null &&
        team.weekPointsAgainst != null &&
        team.weekPoints < team.weekPointsAgainst;
      const tied = !winning && !losing;

      return {
        team,
        isExpanded: expandedCardId === team.id,
        winning,
        losing,
        tied,
        opponent:
          visibleOpponentTeams.find(
            (opponent) => opponent.leagueMasterId === team.leagueMasterId
          ) || null,
      };
    });
  }, [visibleTeams, expandedCardId, visibleOpponentTeams]);

  const toggleCardExpansion = (teamId: string) => {
    setExpandedCardId((prev) => (prev === teamId ? null : teamId));
  };

  return {
    leagueCardsData,
    toggleCardExpansion,
  };
};
