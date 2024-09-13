import { useMemo } from 'react';
import { NFLGame } from "../features/nfl/nflTypes";
import { groupGamesByStartTime } from "../features/nfl/nflUtils";
import nflSchedule from "../assets/nfl-schedule-2024.json";

interface NflWeekSchedule {
  weekNumber: number;
  games: NFLGame[];
}

interface NFLSchedule {
  season: number;
  weeks: NflWeekSchedule[];
}

export const useWeeklySchedule = (selectedWeek: number) => {
  const weeklySchedule = useMemo(() => {
    const schedule = nflSchedule as NFLSchedule;
    const selectedWeekSchedule = schedule.weeks.find(
      (week) => week.weekNumber === selectedWeek
    );
    return selectedWeekSchedule
      ? groupGamesByStartTime(selectedWeekSchedule.games)
      : [];
  }, [selectedWeek]);

  return weeklySchedule;
};