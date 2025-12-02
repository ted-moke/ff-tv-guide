import { ProcessedGame } from "../../hooks/useProcessedSchedule";

export const getUniqueGameId = (game: ProcessedGame) => {
  return `matchup-${game.awayTeam?.codes[0]}-${game.homeTeam?.codes[0]}`;
};