export const getCurrentWeek = () => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const seasonStart = new Date('2025-09-03T00:00:00-04:00'); // First game of 2025 season

  console.log(easternTime);
  console.log(seasonStart);
  console.log(easternTime < seasonStart);
  
  if (easternTime < seasonStart) {
    return 1;
  }

  const weeksPassed = Math.floor((easternTime.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

  return Math.min(Math.max(weeksPassed + 1, 1), 18); // Ensure week is between 1 and 18
};
