import { useMemo } from "react";
import { NFLGame, Player } from "../features/nfl/nflTypes";
import { getTeamByName } from "../features/nfl/nflTeams";
import { getPlayersByTeam } from "../features/players/usePlayers";
import { BucketedGames, GameBucket } from "../hooks/useWeeklySchedule";

export interface ProcessedGame extends Omit<NFLGame, "awayTeam" | "homeTeam"> {
  awayTeam: ReturnType<typeof getTeamByName>;
  homeTeam: ReturnType<typeof getTeamByName>;
  awayPlayers: { starters: Player[]; others: Player[] };
  homePlayers: { starters: Player[]; others: Player[] };
  starters: Player[];
  others: Player[];
  totals: {
    self: {
      starters: number;
      startersWithCopies: number;
      bench: number;
      total: number;
      totalWithCopies: number;
      bestBall: number;
    };
    opponent: {
      starters: number;
      startersWithCopies: number;
      bench: number;
      total: number;
      totalWithCopies: number;
      bestBall: number;
    };
  };
  hasPlayers: boolean;
  isTopGame: boolean;
}

export interface ProcessedGameBucket {
  day: string;
  startingHour: string;
  games: ProcessedGame[];
}

interface ProcessedGames {
  weekNumber: number;
  games: {
    upcoming: ProcessedGameBucket[];
    inProgress: ProcessedGameBucket[];
    completed: ProcessedGameBucket[];
  };
  hasPlayers: boolean;
}

export const useProcessedSchedule = (
  weeklySchedule: BucketedGames | null,
  players: Player[] | null
): ProcessedGames | null => {
  return useMemo(() => {
    if (!players || !weeklySchedule) return null;

    const processGame = (game: NFLGame): ProcessedGame => {
      const awayTeam = getTeamByName(game.awayTeam);
      const homeTeam = getTeamByName(game.homeTeam);

      const awayPlayers = awayTeam
        ? getPlayersByTeam(awayTeam.codes, players)
        : { starters: [], others: [] };
      const homePlayers = homeTeam
        ? getPlayersByTeam(homeTeam.codes, players)
        : { starters: [], others: [] };

      const starters = [...awayPlayers.starters, ...homePlayers.starters];
      const others = [...awayPlayers.others, ...homePlayers.others];

      const totals = {
        self: {
          starters: 0,
          startersWithCopies: 0,
          bench: 0,
          total: 0,
          totalWithCopies: 0,
          bestBall: 0,
        },
        opponent: {
          starters: 0,
          startersWithCopies: 0,
          bench: 0,
          total: 0,
          totalWithCopies: 0,
          bestBall: 0,
        },
      };

      starters.forEach((player) => {
        if (
          player.copies.length > 0 &&
          player.copies.some((copy) => copy.team === "self")
        ) {
          totals.self.total++;
          totals.self.starters++;
        }

        if (
          player.copies.length > 0 &&
          player.copies.some((copy) => copy.team === "opponent")
        ) {
          totals.opponent.total++;
          totals.opponent.starters++;
        }

        player.copies.forEach((copy) => {
          const team = copy.team === "self" ? totals.self : totals.opponent;
          team.totalWithCopies++;
          if (copy.rosterSlotType === "start") {
            team.startersWithCopies++;
          } else if (copy.rosterSlotType === "bestBall") team.bestBall++;
        });
      });
      others.forEach((player) => {
        player.copies.forEach((copy) => {
          const team = copy.team === "self" ? totals.self : totals.opponent;
          team.totalWithCopies++;
          if (copy.rosterSlotType === "bench") team.bench++;
        });
      });

      const hasPlayers = totals.self.total + totals.opponent.total > 0;

      return {
        ...game,
        awayTeam,
        homeTeam,
        starters,
        others,
        awayPlayers,
        homePlayers,
        totals,
        hasPlayers,
        isTopGame: false,
      };
    };

    const processGameBucket = (bucket: GameBucket): ProcessedGameBucket => {
      const processedGames = bucket.games
        .map(processGame)
        .sort((a, b) => b.totals.self.starters - a.totals.self.starters); // Sort by total starters

      if (processedGames.length > 1) {
        const topCount = Math.min(4, Math.ceil(processedGames.length / 2)); // Determine top count
        const threshold = processedGames[topCount - 1]?.totals.self.starters; // Get the starter count of the last top game

        let hasTopGame = false; // Flag to check if there's at least one top game

        processedGames.forEach((game, index) => {
          if (game.totals.self.starters > 0) {
            // Ensure at least one starter
            game.isTopGame =
              index < topCount && 
              (game.totals.self.starters > threshold || 
              (game.totals.self.starters === threshold && game.totals.opponent.starters >= processedGames[topCount - 1]?.totals.opponent.starters)); // Tiebreaker on opponent starters
            if (game.isTopGame) hasTopGame = true; // Set flag if a top game is found
          } else {
            game.isTopGame = false; // No starters means not a top game
          }
        });

        // Ensure at least one top game if there are multiple games
        if (
          processedGames.length > 1 &&
          !hasTopGame &&
          processedGames[0].totals.self.starters > 0
        ) {
          processedGames[0].isTopGame = true; // Set the first game as a top game
        }
      }

      return {
        day: bucket.day,
        startingHour: bucket.startingHour,
        games: processedGames,
      };
    };

    const processedGames: ProcessedGames = {
      weekNumber: weeklySchedule.weekNumber,
      games: {
        inProgress: weeklySchedule.games.inProgress.map(processGameBucket),
        upcoming: weeklySchedule.games.upcoming.map(processGameBucket),
        completed: weeklySchedule.games.completed.map(processGameBucket),
      },
      hasPlayers: false,
    };

    processedGames.hasPlayers = Object.values(processedGames.games).some(
      (buckets) =>
        buckets.some((bucket) => bucket.games.some((game) => game.hasPlayers))
    );

    return processedGames;
  }, [weeklySchedule, players]);
};
