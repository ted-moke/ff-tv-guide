import { useMemo } from "react";
import { Player, OwnedPlayer } from "../nfl/nflTypes";
import { FantasyTeam } from "../teams/teamTypes";
import { useView } from "../view/ViewContext";
import { getCurrentSeason } from "../../utils/seasonUtils";

const IDPPositions = ["DB", "S", "CB", "DE", "EDR", "DL", "IL", "LB"];

// Define the order of positions
const positionOrder = ["QB", "RB", "WR", "TE", "K", "DEF", ...IDPPositions];

// Custom sorting function
const sortPlayers = (a: Player, b: Player) => {
  const aHasSelfCopy = a.copies.some((copy) => copy.team === "self");
  const bHasSelfCopy = b.copies.some((copy) => copy.team === "self");

  if (aHasSelfCopy && !bHasSelfCopy) {
    return -1; // a comes before b
  } else if (!aHasSelfCopy && bHasSelfCopy) {
    return 1; // b comes before a
  }

  const aIndex = positionOrder.indexOf(a.position);
  const bIndex = positionOrder.indexOf(b.position);

  if (aIndex !== bIndex) {
    // If positions are different, sort by position order
    return aIndex - bIndex;
  } else if (aIndex === -1) {
    // If both positions are not in the positionOrder array, sort alphabetically by position
    return a.position.localeCompare(b.position);
  } else {
    // If positions are the same, sort alphabetically by name
    return a.name.localeCompare(b.name);
  }
};

// Sorting function for copies
const sortCopies = (a: OwnedPlayer, b: OwnedPlayer): number => {
  const order = {
    start: 0,
    bestBall: 1,
    bench: 2,
  };
  const teamOrder = {
    self: 0,
    opponent: 1,
  };

  if (a.rosterSlotType !== b.rosterSlotType) {
    return order[a.rosterSlotType] - order[b.rosterSlotType];
  }
  if (a.team !== b.team) {
    return teamOrder[a.team] - teamOrder[b.team];
  }
  return a.leagueName.localeCompare(b.leagueName);
};

export const usePlayers = ({
  includeOpponents = true,
  hideHiddenTeams = false,
  hideBenchPlayers = false,
  hideIDPlayers = false,
}: {
  includeOpponents?: boolean;
  hideHiddenTeams?: boolean;
  hideBenchPlayers?: boolean;
  hideIDPlayers?: boolean;
} = {}) => {
  const {
    userTeams,
    userTeamsLoading,
    userTeamsError,
    opponentTeams,
    opponentTeamsLoading,
    opponentTeamsError,
    visibleTeams,
    visibleOpponentTeams,
  } = useView();

  const teamsToUse = useMemo(() => {
    if (hideHiddenTeams) {
      return visibleTeams;
    }
    const currentSeason = getCurrentSeason();
    return Object.values(userTeams[currentSeason]);
  }, [visibleTeams, userTeams, hideHiddenTeams]);

  const opponentTeamsToUse = useMemo(() => {
    if (hideHiddenTeams) {
      return visibleOpponentTeams;
    }
    return opponentTeams;
  }, [visibleOpponentTeams, opponentTeams, hideHiddenTeams]);

  let hasIDPlayers = false;

  const players: Player[] | null = useMemo(() => {
    if (!teamsToUse || (includeOpponents && !opponentTeamsToUse)) {
      return null;
    }

    const playerMap = new Map<string, Player>();

    const processTeams = (
      teams: FantasyTeam[],
      teamType: "self" | "opponent"
    ) => {
      teams.forEach((team) => {
        team.playerData.forEach((player) => {
          if (IDPPositions.includes(player.position)) {
            hasIDPlayers = true;

            if (hideIDPlayers) {
              return;
            }
          }
          // if there's two players with the same name AND position, this could break
          // but it's unlikely. TODO fix this
          const key = `${player.name}-${player.position}`;
          if (!playerMap.has(key)) {
            playerMap.set(key, {
              name: player.name,
              team: player.team,
              position: player.position,
              copies: [],
            });
          }

          // TODO move this to backend
          // make short league name, 4 char max, strip out leading "the", spaces, etc
          const shortLeagueName = team.leagueName
            .replace(/\b(the|dynasty|league|afl|nfl)\b/gi, "") // Remove 'the' and 'dynasty' (case insensitive)
            .replace(/[^a-zA-Z]/g, "") // Remove non-letter characters
            .toUpperCase() // Convert to lowercase
            .slice(0, 5); // Limit to 4 characters

          const ownedPlayer: OwnedPlayer = {
            leagueName: team.leagueName,
            shortLeagueName: shortLeagueName,
            leagueId: team.leagueId,
            externalLeagueId: team.externalLeagueId,
            platformId: team.platformId,
            rosterSlotType: player.rosterSlotType as
              | "start"
              | "bench"
              | "bestBall",
            team: teamType,
          };
          if (hideBenchPlayers && ownedPlayer.rosterSlotType === "bench") {
            return;
          }
          playerMap.get(key)!.copies.push(ownedPlayer);
        });
      });
    };

    if (teamsToUse) {
      processTeams(teamsToUse, "self");
    }

    if (includeOpponents && opponentTeamsToUse) {
      processTeams(opponentTeamsToUse, "opponent");
    }

    // Sort copies for each player
    playerMap.forEach((player) => {
      player.copies.sort(sortCopies);
    });

    return Array.from(playerMap.values()).sort(sortPlayers);
  }, [
    teamsToUse,
    opponentTeamsToUse,
    hideHiddenTeams,
    hideBenchPlayers,
    hideIDPlayers,
    hasIDPlayers,
  ]);

  return {
    players,
    isLoading: userTeamsLoading || opponentTeamsLoading,
    error: userTeamsError || opponentTeamsError,
    hasIDPlayers,
  };
};

// Update getPlayersByTeam function to use the new Player type
export const getPlayersByTeam = (teamCodes: string[], players: Player[]) => {
  const teamPlayers = players.filter((player) =>
    teamCodes.includes(player.team)
  );

  const selfPlayers = teamPlayers.filter((player) =>
    player.copies.some((copy) => copy.team === "self")
  );

  const opponentPlayers = teamPlayers.filter((player) =>
    player.copies.some((copy) => copy.team === "opponent")
  );

  const filteredStarters = teamPlayers
    .filter((player) =>
      player.copies.some((copy) => copy.rosterSlotType === "start")
    )
    .map((player) => ({
      ...player,
      copies: player.copies.filter((copy) => copy.rosterSlotType === "start"),
    }));

  const filteredOthers = teamPlayers
    .filter(
      (player) =>
        player.copies.some((copy) => copy.rosterSlotType !== "start") &&
        player.copies.some((copy) => copy.team === "self")
    )
    .map((player) => ({
      ...player,
      copies: player.copies.filter(
        (copy) => copy.rosterSlotType !== "start" && copy.team === "self"
      ),
    }));

  const sortPlayers = (a: Player, b: Player) => {
    const aHasSelfCopy = a.copies.some((copy) => copy.team === "self");
    const bHasSelfCopy = b.copies.some((copy) => copy.team === "self");

    if (aHasSelfCopy && !bHasSelfCopy) {
      return -1; // a comes before b
    } else if (!aHasSelfCopy && bHasSelfCopy) {
      return 1; // b comes before a
    }

    const aIndex = positionOrder.indexOf(a.position);
    const bIndex = positionOrder.indexOf(b.position);

    if (aIndex !== bIndex) {
      // If positions are different, sort by position order
      return aIndex - bIndex;
    } else if (aIndex === -1) {
      // If both positions are not in the positionOrder array, sort alphabetically by position
      return a.position.localeCompare(b.position);
    } else {
      // If positions are the same, sort alphabetically by name
      return a.name.localeCompare(b.name);
    }
  };

  return {
    starters: filteredStarters.sort(sortPlayers),
    others: filteredOthers.sort(sortPlayers),
    allSelf: selfPlayers.sort(sortPlayers),
    allOpponent: opponentPlayers.sort(sortPlayers),
    all: teamPlayers.sort(sortPlayers),
  };
};
