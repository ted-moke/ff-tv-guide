import { useState, useMemo } from "react";
import { useView } from "../view/ViewContext";
import { CURRENT_SEASON } from "../../constants";
import { FantasyTeam } from "../teams/teamTypes";

export interface LeagueCardData {
  team: FantasyTeam;
  isExpanded: boolean;
  winning: boolean;
  losing: boolean;
  tied: boolean;
}

export const useLeagueCards = () => {
  const { userTeams } = useView();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const leagueCardsData = useMemo((): LeagueCardData[] => {
    if (!userTeams || !userTeams[CURRENT_SEASON]) {
      return [];
    }

    return Object.values(userTeams[CURRENT_SEASON]).map((team) => {
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
      };
    });
  }, [userTeams, expandedCardId]);

  const toggleCardExpansion = (teamId: string) => {
    setExpandedCardId((prev) => (prev === teamId ? null : teamId));
  };

  return {
    leagueCardsData,
    toggleCardExpansion,
  };
};
