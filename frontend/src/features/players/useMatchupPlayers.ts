import { usePlayers } from "./usePlayers";
import { useWeeklySchedule } from "../../hooks/useWeeklySchedule";
import { useProcessedSchedule } from "../../hooks/useProcessedSchedule";

export const useMatchupPlayers = (selectedWeek: number) => {
  const {
    players,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayers({
    hideHiddenTeams: true,
  });
  const weeklySchedule = useWeeklySchedule(selectedWeek);
  const isLoading = playersLoading || !weeklySchedule;
  const error =
    playersError ||
    (!weeklySchedule && !isLoading
      ? new Error("Failed to load schedule")
      : null);


  const processedSchedule = useProcessedSchedule(weeklySchedule, players);

  return {
    hasPlayers: processedSchedule?.hasPlayers,
    matchupPlayers: processedSchedule,
    isLoading: isLoading,
    initialized: processedSchedule !== null,
    error,
  };
};
