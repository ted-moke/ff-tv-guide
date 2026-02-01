export const CURRENT_SEASON = 2026;

export const getCurrentSeason = () => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  // const seasonStart = new Date(`${CURRENT_SEASON}-09-03T00:00:00-04:00`); // First game of current season
  const seasonEnd = new Date(`${CURRENT_SEASON + 1}-01-03T00:00:00-04:00`); // End of current season

  if (easternTime > seasonEnd) {
    return CURRENT_SEASON + 1;
  }

  return CURRENT_SEASON;
};
