import { useMemo } from 'react';
import { Player } from '../nfl/nflTypes';
import useUserTeams from '../teams/useUserTeams';

// Define the order of positions
const positionOrder = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'DB', 'S', 'CB', 'DL', 'DE', 'LB'];

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

export const getPlayersByTeam = (teamCode: string, players: Player[]): { starters: Player[], others: Player[] } => {
  const teamPlayers = players.filter(player => player.team === teamCode);
  return {
    starters: teamPlayers.filter(player => player.isStarter).sort(sortPlayers),
    others: teamPlayers.filter(player => !player.isStarter).sort(sortPlayers),
  };
};

export const usePlayers = () => {
  const { data: userTeams, isLoading, error } = useUserTeams();

  const { starters, others } = useMemo(() => {
    if (!userTeams) return { starters: [], others: [] };

    const playerMap = new Map<string, Player>();

    Object.values(userTeams).forEach((team) => {
      team.playerData.forEach((player) => {
        const key = player.name;
        if (playerMap.has(key)) {
          playerMap.get(key)?.userTeams.push(team.leagueName);
          if (player.rosterSlotType === "start")
            playerMap.get(key)!.isStarter = true;
        } else {
          playerMap.set(key, {
            ...player,
            userTeams: [team.leagueName],
            isStarter: player.rosterSlotType === "start",
          });
        }
      });
    });

    const allPlayers = Array.from(playerMap.values()).sort(sortPlayers);

    return {
      starters: allPlayers.filter((player) => player.isStarter),
      others: allPlayers.filter((player) => !player.isStarter),
    };
  }, [userTeams]);

  return { players: { starters, others }, isLoading, error };
};