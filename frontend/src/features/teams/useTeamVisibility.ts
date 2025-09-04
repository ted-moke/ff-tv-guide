import { useMemo, useState, useEffect, useRef } from "react";
import { FantasyTeam } from "./teamTypes";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../utils/localStorage";

const HIDDEN_TEAMS_KEY = "ff-tv-guide:hidden-teams";
const HIDDEN_OPPONENT_TEAMS_KEY = "ff-tv-guide:hidden-opponent-teams";

export const useTeamVisibility = ({
  userTeams,
  opponentTeams,
}: {
  userTeams: FantasyTeam[];
  opponentTeams: FantasyTeam[];
}) => {
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set());
  const [hiddenOpponentTeams, setHiddenOpponentTeams] = useState<Set<string>>(
    new Set()
  );
  const isInitialized = useRef(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedHiddenTeams = getLocalStorageItem<string[]>(
      HIDDEN_TEAMS_KEY,
      []
    );
    const storedHiddenOpponentTeams = getLocalStorageItem<string[]>(
      HIDDEN_OPPONENT_TEAMS_KEY,
      []
    );

    setHiddenTeams(new Set(storedHiddenTeams));
    setHiddenOpponentTeams(new Set(storedHiddenOpponentTeams));
    isInitialized.current = true;
  }, []);

  const hideTeam = (leagueId: string) => {
    let newSet: Set<string>;
    setHiddenTeams((prev) => {
      newSet = new Set(prev);
      newSet.add(leagueId);
      setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSet));
      return newSet;
    });
  };

  const showTeam = (leagueId: string) => {
    let newSet: Set<string>;
    setHiddenTeams((prev) => {
      newSet = new Set(prev);
      newSet.delete(leagueId);
      setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSet));
      return newSet;
    });
  };

  const hideOpponentTeam = (leagueId: string) => {
    let newSet: Set<string>;
    setHiddenOpponentTeams((prev) => {
      newSet = new Set(prev);
      newSet.add(leagueId);
      setLocalStorageItem(HIDDEN_OPPONENT_TEAMS_KEY, Array.from(newSet));
      return newSet;
    });
  };

  const showOpponentTeam = (leagueId: string) => {
    let newSet: Set<string>;
    setHiddenOpponentTeams((prev) => {
      newSet = new Set(prev);
      newSet.delete(leagueId);
      setLocalStorageItem(HIDDEN_OPPONENT_TEAMS_KEY, Array.from(newSet));
      return newSet;
    });
  };

  const hideAllTeams = () => {
    let newSetHiddenTeams = new Set(userTeams.map((team) => team.leagueId));
    let newSetHiddenOpponentTeams = new Set(
      opponentTeams.map((team) => team.leagueId)
    );
    setHiddenTeams(newSetHiddenTeams);
    setHiddenOpponentTeams(newSetHiddenOpponentTeams);
    setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSetHiddenTeams));
    setLocalStorageItem(
      HIDDEN_OPPONENT_TEAMS_KEY,
      Array.from(newSetHiddenOpponentTeams)
    );
  };

  const showAllTeams = () => {
    let newSetHiddenTeams = new Set<string>();
    let newSetHiddenOpponentTeams = new Set<string>();
    setHiddenTeams(newSetHiddenTeams);
    setHiddenOpponentTeams(newSetHiddenOpponentTeams);
    setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSetHiddenTeams));
    setLocalStorageItem(
      HIDDEN_OPPONENT_TEAMS_KEY,
      Array.from(newSetHiddenOpponentTeams)
    );
  };

  const visibleTeams = useMemo(() => {
    return userTeams.filter((team) => !hiddenTeams.has(team.leagueId));
  }, [userTeams, hiddenTeams]);

  const visibleOpponentTeams = useMemo(() => {
    return opponentTeams.filter(
      (team) => !hiddenOpponentTeams.has(team.leagueId)
    );
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
  };
};
