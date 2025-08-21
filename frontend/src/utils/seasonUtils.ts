export const getCurrentSeason = () => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const seasonStart = new Date("2025-09-03T00:00:00-04:00"); // First game of 2025 season
  const seasonEnd = new Date("2026-03-01T00:00:00-04:00"); // End of 2026 season

  if (easternTime > seasonEnd) {
    return 2026;
  }

  return 2025;
};