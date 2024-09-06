import { useMemo } from 'react';
import { Player } from '../nfl/nflTypes';
import useUserTeams from '../teams/useUserTeams';

export const getPlayersByTeam = (teamCode: string, players: Player[]): { starters: Player[], others: Player[] } => {
  const teamPlayers = players.filter(player => player.team === teamCode);
  return {
    starters: teamPlayers.filter(player => player.isStarter),
    others: teamPlayers.filter(player => !player.isStarter),
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

    const allPlayers = Array.from(playerMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      starters: allPlayers.filter((player) => player.isStarter),
      others: allPlayers.filter((player) => !player.isStarter),
    };
  }, [userTeams]);

  return { players: { starters, others }, isLoading, error };
};