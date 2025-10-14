import nflSchedule from "../assets/nfl-schedule-2025.json";

/**
 * Get the current NFL week based on the current date
 * @returns The current week number (1-18) or null if before/after season
 */
export const getCurrentWeek = (): number | null => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const seasonStart = new Date("2025-09-03T00:00:00-04:00"); // First game of 2025 season
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  // If the current date is more than 3 days before the season start, return null
  if (easternTime < new Date(seasonStart.getTime() - THREE_DAYS)) {
    return null;
  }

  if (easternTime < seasonStart) {
    return 1;
  }

  const weeksPassed = Math.floor(
    (easternTime.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  if (weeksPassed >= 19) {
    return null;
  }

  return Math.min(Math.max(weeksPassed + 1, 1), 18); // Ensure week is between 1 and 18
};

/**
 * Parse game time from schedule data
 * @param date - The date string from schedule data
 * @param time - The time string from schedule data
 * @returns A Date object in Eastern timezone
 */
export const parseGameTime = (date: string, time: string): Date => {
  // Create date in Eastern timezone
  const gameDate = new Date(`${date}T${time}:00-04:00`);
  return gameDate;
};

/**
 * Find the first game of a given week
 * @param weekNumber - The week number to find the first game for
 * @returns The Date of the first game of the week, or null if not found
 */
export const getFirstGameOfWeek = (weekNumber: number): Date | null => {
  const week = nflSchedule.weeks.find((w) => w.weekNumber === weekNumber);
  if (!week || !week.games.length) {
    return null;
  }

  // Find the earliest game of the week
  let earliestGame = week.games[0];
  for (const game of week.games) {
    const gameTime = parseGameTime(game.date, game.time);
    const earliestTime = parseGameTime(earliestGame.date, earliestGame.time);
    if (gameTime < earliestTime) {
      earliestGame = game;
    }
  }

  return parseGameTime(earliestGame.date, earliestGame.time);
};

/**
 * Check if the current week has started based on the day of the week and game times
 * @returns True if the week has started, false otherwise
 */
export const hasWeekStarted = (): boolean => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const day = easternTime.getDay();

  if (day === 0 || day === 1) {
    return true;
  }

  // If it's Tuesday (2) or Wednesday (3), the new week hasn't started yet
  if (day === 2 || day === 3) {
    return false;
  }

  // If it's Thursday (4), check if the first game of the current week has started
  if (day === 4) {
    const currentWeek = getCurrentWeek();
    if (!currentWeek) {
      return false;
    }

    const firstGameTime = getFirstGameOfWeek(currentWeek);
    if (!firstGameTime) {
      return false;
    }

    return easternTime >= firstGameTime;
  }

  // For all other days (Friday-Sunday), the week has started
  return true;
};

export const thruSundayDayGames = (): boolean => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  
  // If it's sunday and after 7:30 PM, or monday return true
  if (easternTime.getDay() === 0 && easternTime.getHours() >= 19 && easternTime.getMinutes() >= 30) {
    return true;
  }
  if (easternTime.getDay() === 1) {
    return true;
  }
  return false;
};