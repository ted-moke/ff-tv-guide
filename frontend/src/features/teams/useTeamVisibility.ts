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


  // Update localStorage whenever hidden teams change (but not during initialization)
  // useEffect(() => {
  //   if (isInitialized.current === true) {
  //     setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(hiddenTeams));
  //   }
  // }, [hiddenTeams]);

  // useEffect(() => {
  //   if (isInitialized.current === true) {
  //     console.log("updating localStorage for hidden opponent teams", hiddenOpponentTeams);
  //     setLocalStorageItem(HIDDEN_OPPONENT_TEAMS_KEY, Array.from(hiddenOpponentTeams));
  //   }
  // }, [hiddenOpponentTeams]);

  const hideTeam = (leagueId: string) => {
    let newSet;
    setHiddenTeams((prev) => {
      newSet = new Set(prev);
      newSet.add(leagueId);
      return newSet;
    });

    if (newSet) {
      setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSet));
    } else {
      console.log("newSet is undefined");
    }
  };

  const showTeam = (leagueId: string) => {
    let newSet;
    setHiddenTeams((prev) => {
      newSet = new Set(prev);
      newSet.delete(leagueId);
      return newSet;
    });

    if (newSet) {
      setLocalStorageItem(HIDDEN_TEAMS_KEY, Array.from(newSet));
    }
  };

  const hideOpponentTeam = (leagueId: string) => {
    let newSet;
    setHiddenOpponentTeams((prev) => {
      newSet = new Set(prev);
      newSet.add(leagueId);
      return newSet;
    });

    if (newSet) {
      setLocalStorageItem(HIDDEN_OPPONENT_TEAMS_KEY, Array.from(newSet));
    }
  };

  const showOpponentTeam = (leagueId: string) => {
    let newSet;
    setHiddenOpponentTeams((prev) => {
      newSet = new Set(prev);
      newSet.delete(leagueId);
      return newSet;
    });

    if (newSet) {
      setLocalStorageItem(HIDDEN_OPPONENT_TEAMS_KEY, Array.from(newSet));
    }
  };

  const hideAllTeams = () => {
    setHiddenTeams(new Set(userTeams.map((team) => team.leagueId)));
    setHiddenOpponentTeams(new Set(opponentTeams.map((team) => team.leagueId)));
  };

  const showAllTeams = () => {
    setHiddenTeams(new Set());
    setHiddenOpponentTeams(new Set());
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
