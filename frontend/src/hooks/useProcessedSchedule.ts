import { useMemo } from "react";
import { NFLGame, Player } from "../features/nfl/nflTypes";
import { getTeamByName } from "../features/nfl/nflTeams";
import { getPlayersByTeam } from "../features/players/usePlayers";
import { BucketedGames } from "../hooks/useWeeklySchedule"; // Add this import

export interface ProcessedGame extends Omit<NFLGame, "awayTeam" | "homeTeam"> {
  awayTeam: ReturnType<typeof getTeamByName>;
  homeTeam: ReturnType<typeof getTeamByName>;
  starters: Player[];
  others: Player[];
  totals: {
    self: {
      starters: number;
      bench: number;
      total: number;
      bestBall: number;
    };
    opponent: {
      starters: number;
      bench: number;
      total: number;
      bestBall: number;
    };
  };
  hasPlayers: boolean;
}

export const useProcessedSchedule = (
  weeklySchedule: BucketedGames | null,
  players: Player[] | null
) => {
  return useMemo(() => {
    if (!players || !weeklySchedule) return null;

    const processGames = (games: NFLGame[]): ProcessedGame[] =>
      games.map((game: NFLGame): ProcessedGame => {
        const awayTeam = getTeamByName(game.awayTeam);
        const homeTeam = getTeamByName(game.homeTeam);

        if (!awayTeam || !homeTeam) {
          return {
            ...game,
            awayTeam,
            homeTeam,
            starters: [],
            others: [],
            totals: {
              self: { starters: 0, bench: 0, total: 0, bestBall: 0 },
              opponent: { starters: 0, bench: 0, total: 0, bestBall: 0 }
            },
            hasPlayers: false,
          };
        }

        const awayPlayers = getPlayersByTeam(awayTeam?.code, players);
        const homePlayers = getPlayersByTeam(homeTeam?.code, players);

        const starters = [...awayPlayers.starters, ...homePlayers.starters];
        const others = [...awayPlayers.others, ...homePlayers.others];

        const totals = {
          self: { starters: 0, bench: 0, total: 0, bestBall: 0 },
          opponent: { starters: 0, bench: 0, total: 0, bestBall: 0 }
        };

        [...starters, ...others].forEach(player => {
          player.copies.forEach(copy => {
            const team = copy.team === 'self' ? totals.self : totals.opponent;
            team.total++;
            if (copy.rosterSlotType === 'start') team.starters++;
            else if (copy.rosterSlotType === 'bench') team.bench++;
            else if (copy.rosterSlotType === 'bestBall') team.bestBall++;
          });
        });

        const hasPlayers = totals.self.total + totals.opponent.total > 0;

        return {
          ...game,
          awayTeam,
          homeTeam,
          starters,
          others,
          totals,
          hasPlayers,
        };
      });

    const upcomingGames = processGames(weeklySchedule.games.upcoming);
    const inProgressGames = processGames(weeklySchedule.games.inProgress);
    const completedGames = processGames(weeklySchedule.games.completed);

    return {
      weekNumber: weeklySchedule.weekNumber,
      games: {
        upcoming: upcomingGames,
        inProgress: inProgressGames,
        completed: completedGames,
      },
    };
  }, [weeklySchedule, players]);
};
