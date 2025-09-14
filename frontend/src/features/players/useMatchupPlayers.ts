import { Player } from "../nfl/nflTypes";
import { useWeeklySchedule } from "../../hooks/useWeeklySchedule";
import { useProcessedSchedule } from "../../hooks/useProcessedSchedule";

export const useMatchupPlayers = ({
  selectedWeek,
  players,
}: {
  selectedWeek: number;
  players: Player[];
}) => {
  const weeklySchedule = useWeeklySchedule(selectedWeek);
  const isLoading = !players || !weeklySchedule;
  const error =
    !weeklySchedule && !isLoading ? new Error("Failed to load schedule") : null;

  const processedSchedule = useProcessedSchedule(weeklySchedule, players);

  return {
    matchupPlayers: processedSchedule,
    isLoading: isLoading,
    initialized: processedSchedule !== null,
    error,
  };
};
