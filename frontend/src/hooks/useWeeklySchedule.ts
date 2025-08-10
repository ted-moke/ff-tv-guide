import { useMemo } from "react";
import { NFLGame } from "../features/nfl/nflTypes";
import nflSchedule from "../assets/nfl-schedule-2025.json";

interface NflWeekSchedule {
  weekNumber: number;
  games: NFLGame[];
}

interface NFLSchedule {
  season: number;
  weeks: NflWeekSchedule[];
}

export interface GameBucket {
  day: string;
  startingHour: string;
  games: NFLGame[];
  fullDate: Date; // Added fullDate property
}

export interface BucketedGames {
  weekNumber: number;
  games: {
    upcoming: GameBucket[];
    inProgress: GameBucket[];
    completed: GameBucket[];
  };
}

export const useWeeklySchedule = (selectedWeek: number) => {
  const weeklySchedule = useMemo(() => {
    const schedule = nflSchedule as NFLSchedule;
    const selectedWeekSchedule = schedule.weeks.find(
      (week) => week.weekNumber === selectedWeek
    );

    if (!selectedWeekSchedule) {
      return null;
    }

    const now = new Date();

    const bucketedGames: BucketedGames = {
      weekNumber: selectedWeekSchedule.weekNumber,
      games: {
        upcoming: [],
        inProgress: [],
        completed: [],
      },
    };

    const addGameToBucket = (game: NFLGame, bucket: GameBucket[]) => {
      // Parse date and time
      const [year, month, day] = game.date.split("-").map(Number);
      const [hours, minutes] = game.time.split(":").map(Number);

      // Create date object (months are 0-indexed in JavaScript)
      const gameStartTime = new Date(year, month - 1, day, hours, minutes);

      let existingBucket = bucket.find(
        (b) =>
          b.day ===
            gameStartTime.toLocaleString("en-US", {
              weekday: "short",
            }) &&
          b.startingHour ===
            gameStartTime.toLocaleString("en-US", {
              hour: "numeric",
              hour12: true,
            })
      );
      if (!existingBucket) {
        existingBucket = {
          day: gameStartTime.toLocaleString("en-US", {
            weekday: "short",
          }),
          startingHour: gameStartTime.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
          }),
          games: [],
          fullDate: gameStartTime,
        };
        bucket.push(existingBucket);
      }
      existingBucket.games.push(game);
    };

    selectedWeekSchedule.games.forEach((game) => {
      // Parse date and time
      const [year, month, day] = game.date.split("-").map(Number);
      const [hours, minutes] = game.time.split(":").map(Number);

      // Create date object (months are 0-indexed in JavaScript)
      const gameStartTime = new Date(year, month - 1, day, hours, minutes);

      const gameEndTime = new Date(
        gameStartTime.getTime() + 3 * 60 * 60 * 1000 // Changed to 3 hours game duration
      );

      if (now < gameStartTime) {
        addGameToBucket(game, bucketedGames.games.upcoming);
      } else if (now >= gameStartTime && now <= gameEndTime) {
        addGameToBucket(game, bucketedGames.games.inProgress);
      } else {
        addGameToBucket(game, bucketedGames.games.completed);
      }
    });

    // Sort buckets by fullDate
    const sortBuckets = (buckets: GameBucket[]) => {
      return buckets.sort(
        (a, b) => a.fullDate.getTime() - b.fullDate.getTime()
      );
    };

    bucketedGames.games.upcoming = sortBuckets(bucketedGames.games.upcoming);
    bucketedGames.games.inProgress = sortBuckets(
      bucketedGames.games.inProgress
    );
    bucketedGames.games.completed = sortBuckets(bucketedGames.games.completed);

    return bucketedGames;
  }, [selectedWeek]);

  return weeklySchedule;
};
