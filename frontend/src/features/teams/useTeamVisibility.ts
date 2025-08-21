import { useMemo, useState } from "react";
import { useView } from "../view/ViewContext";

export const useTeamVisibility = () => {
  const { userTeams, opponentTeams } = useView();
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set());
  const [hiddenOpponentTeams, setHiddenOpponentTeams] = useState<Set<string>>(new Set());

  const hideTeam = (leagueId: string) => {
    setHiddenTeams((prev) => {
        const newSet = new Set(prev);
        newSet.add(leagueId);
        return newSet;
    });
    setHiddenOpponentTeams((prev) => {
        const newSet = new Set(prev);
        newSet.add(leagueId);
        return newSet;
    });
  }

  const showTeam = (leagueId: string) => {
    setHiddenTeams((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leagueId);
        return newSet;
    });
    setHiddenOpponentTeams((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leagueId);
        return newSet;
    });
  }

  const hideAllTeams = () => {
    setHiddenTeams(new Set(userTeams.map((team) => team.leagueId)));
    setHiddenOpponentTeams(new Set(opponentTeams.map((team) => team.leagueId)));
  }

  const showAllTeams = () => {
    setHiddenTeams(new Set());
    setHiddenOpponentTeams(new Set());
  }

  const hideOpponentTeam = (leagueId: string) => {
    setHiddenOpponentTeams((prev) => {
        const newSet = new Set(prev);
        newSet.add(leagueId);
        return newSet;
    });
  }

  const showOpponentTeam = (leagueId: string) => {
    setHiddenOpponentTeams((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leagueId);
        return newSet;
    });
  }

  const visibleTeams = useMemo(() => {
    return userTeams.filter((team) => !hiddenTeams.has(team.leagueId));
  }, [userTeams, hiddenTeams]);

  const visibleOpponentTeams = useMemo(() => {
    return opponentTeams.filter((team) => !hiddenOpponentTeams.has(team.leagueId));
  }, [opponentTeams, hiddenOpponentTeams]);

  return {
    visibleTeams,
    hideTeam,
    showTeam,
    hideAllTeams,
    showAllTeams,
    visibleOpponentTeams,
    hideOpponentTeam,
    showOpponentTeam,
  }
};