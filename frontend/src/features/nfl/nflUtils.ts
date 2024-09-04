import { NFLGame } from "./nflTypes";

export const groupGamesByStartTime = (games: NFLGame[]) => {
  const groupedGames: { [key: string]: NFLGame[] } = {};
  games.forEach(game => {
    const key = `${game.date} ${game.time}`;
    if (!groupedGames[key]) {
      groupedGames[key] = [];
    }
    groupedGames[key].push(game);
  });
  return Object.entries(groupedGames).sort(([a], [b]) => {
    const dateA = new Date(a.replace(' ', 'T') + 'Z');
    const dateB = new Date(b.replace(' ', 'T') + 'Z');
    return dateA.getTime() - dateB.getTime();
  });
};