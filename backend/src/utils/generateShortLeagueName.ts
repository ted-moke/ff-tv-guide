export const generateShortLeagueName = (leagueName: string) => {
  return leagueName
    .replace(/\b(the|dynasty|league|afl|nfl)\b/gi, "") // Remove 'the' and 'dynasty' (case insensitive)
    .replace(/[^a-zA-Z]/g, "") // Remove non-letter characters
    .toUpperCase() // Convert to lowercase
    .slice(0, 5); // Limit to 4 characters
};
