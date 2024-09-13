import { useMemo } from 'react';
import { NFLGame, Player } from "../features/nfl/nflTypes";
import { getTeamByName } from "../features/nfl/nflTeams";
import { getPlayersByTeam } from "../features/players/usePlayers";

interface ProcessedGame extends NFLGame {
  awayTeam: ReturnType<typeof getTeamByName>;
  homeTeam: ReturnType<typeof getTeamByName>;
  awayPlayers: {
    starters: Player[];
    others: Player[];
  };
  homePlayers: {
    starters: Player[];
    others: Player[];
  };
  starterCount: number;
  totalPlayers: number;
  hasPlayers: boolean;
}

export const useProcessedSchedule = (
  weeklySchedule: [string, NFLGame[]][],
  players: { starters: Player[]; others: Player[] } | null
) => {
  return useMemo(() => {
    if (!players || !weeklySchedule) return [];

    const { starters, others } = players;

    return weeklySchedule.map(([startTime, games]) => [
      startTime,
      games.map((game: NFLGame): ProcessedGame => {
        const awayTeam = getTeamByName(game.awayTeam);
        const homeTeam = getTeamByName(game.homeTeam);

        const awayPlayers = awayTeam
          ? getPlayersByTeam(awayTeam.code, [...starters, ...others])
          : { starters: [], others: [] };
        const homePlayers = homeTeam
          ? getPlayersByTeam(homeTeam.code, [...starters, ...others])
          : { starters: [], others: [] };

        const starterCount =
          awayPlayers.starters.length + homePlayers.starters.length;
        const totalPlayers = [
          ...awayPlayers.starters,
          ...awayPlayers.others,
          ...homePlayers.starters,
          ...homePlayers.others,
        ].reduce((sum, player) => sum + player.userTeams.length, 0);

        const hasPlayers = totalPlayers > 0;

        return {
          ...game,
          awayTeam,
          homeTeam,
          awayPlayers,
          homePlayers,
          starterCount,
          totalPlayers,
          hasPlayers,
        };
      }),
    ]);
  }, [weeklySchedule, players]);
};