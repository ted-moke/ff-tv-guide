import { useMemo } from "react";
import { Player, OwnedPlayer } from "../nfl/nflTypes";
import useUserTeams from "../teams/useUserTeams";

// Define the order of positions
const positionOrder = [
  "QB",
  "RB",
  "WR",
  "TE",
  "K",
  "DEF",
  "DB",
  "S",
  "CB",
  "DL",
  "DE",
  "LB",
];

// Custom sorting function
const sortPlayers = (a: Player, b: Player) => {
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

export const usePlayers = () => {
  const { data: userTeams, isLoading, error } = useUserTeams();

  const players: Player[] = useMemo(() => {
    if (!userTeams) return [];

    const playerMap = new Map<string, Player>();

    userTeams.forEach((team) => {
      team.playerData.forEach((player) => {
        const key = `${player.name}-${player.team}`;
        if (!playerMap.has(key)) {
          playerMap.set(key, {
            name: player.name,
            team: player.team,
            position: player.position,
            copies: [],
          });
        }

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
          rosterSlotType: player.rosterSlotType as
            | "start"
            | "bench"
            | "bestBall",
          team: "self",
        };
        playerMap.get(key)!.copies.push(ownedPlayer);
      });
    });

    // Sort copies for each player
    playerMap.forEach((player) => {
      player.copies.sort(sortCopies);
    });

    return Array.from(playerMap.values());
  }, [userTeams]);

  return { players, isLoading, error };
};

// Update getPlayersByTeam function to use the new Player type
export const getPlayersByTeam = (
  teamCode: string,
  players: Player[]
): { starters: Player[]; others: Player[] } => {
  const teamPlayers = players.filter((player) => player.team === teamCode);
  return {
    starters: teamPlayers
      .filter((player) =>
        player.copies.some((copy) => copy.rosterSlotType === "start")
      )
      .sort(sortPlayers),
    others: teamPlayers
      .filter(
        (player) =>
          !player.copies.some((copy) => copy.rosterSlotType === "start")
      )
      .sort(sortPlayers),
  };
};
