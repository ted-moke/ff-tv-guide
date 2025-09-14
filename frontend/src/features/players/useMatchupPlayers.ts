import { Player } from "../nfl/nflTypes";
import {
  BucketedGames,
} from "../../hooks/useWeeklySchedule";
import { useProcessedSchedule } from "../../hooks/useProcessedSchedule";

export const useMatchupPlayers = ({
  players,
  weeklySchedule,
}: {
  players: Player[];
  weeklySchedule: BucketedGames | null;
}) => {
  const isLoading = !players || !weeklySchedule;

  let error = null;

  if (!weeklySchedule && !isLoading) {
    error = new Error("Failed to load schedule");
  }

  const processedSchedule = useProcessedSchedule(weeklySchedule, players);

  return {
    matchupPlayers: processedSchedule,
    isLoading: isLoading,
    initialized: processedSchedule !== null,
    error,
  };
};
