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

export const usePlayers = () => {
  const { data: userTeams, isLoading, error } = useUserTeams();
  debugger

  const players: Player[] = useMemo(() => {
    if (!userTeams) return [];

    const playerMap = new Map<string, Player>();

    userTeams.forEach(team => {
      team.playerData.forEach(player => {
        const key = `${player.name}-${player.team}`;
        if (!playerMap.has(key)) {
          playerMap.set(key, {
            name: player.name,
            team: player.team,
            position: player.position,
            copies: []
          });
        }
        const ownedPlayer: OwnedPlayer = {
          leagueName: team.leagueName,
          leagueId: team.leagueId,
          rosterSlotType: player.rosterSlotType as 'start' | 'bench' | 'bestBall',
          team: 'self'
        };
        playerMap.get(key)!.copies.push(ownedPlayer);
      });
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
      .filter((player) => player.copies.some(copy => copy.rosterSlotType === 'start'))
      .sort(sortPlayers),
    others: teamPlayers
      .filter((player) => !player.copies.some(copy => copy.rosterSlotType === 'start'))
      .sort(sortPlayers),
  };
};

