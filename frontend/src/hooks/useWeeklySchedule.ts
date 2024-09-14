import { useMemo } from 'react';
import { NFLGame } from "../features/nfl/nflTypes";
import nflSchedule from "../assets/nfl-schedule-2024.json";

interface NflWeekSchedule {
  weekNumber: number;
  games: NFLGame[];
}

interface NFLSchedule {
  season: number;
  weeks: NflWeekSchedule[];
}

export interface BucketedGames {
  weekNumber: number;
  games: {
    upcoming: NFLGame[];
    inProgress: NFLGame[];
    completed: NFLGame[];
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
        completed: []
      }
    };

    selectedWeekSchedule.games.forEach(game => {
      const gameStartTime = new Date(`${game.date} ${game.time}`);
      const gameEndTime = new Date(gameStartTime.getTime() + 4 * 60 * 60 * 1000); // Assuming 4 hours game duration

      if (now < gameStartTime) {
        bucketedGames.games.upcoming.push(game);
      } else if (now >= gameStartTime && now <= gameEndTime) {
        bucketedGames.games.inProgress.push(game);
      } else {
        bucketedGames.games.completed.push(game);
      }
    });

    return bucketedGames;
  }, [selectedWeek]);

  return weeklySchedule;
};