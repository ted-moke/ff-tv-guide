import { useView } from "../view/ViewContext";

export const useIsTeamVisible = ({
  teamId,
  opponentId,
}: {
  teamId: string;
  opponentId: string;
}) => {
  const { visibleTeams, visibleOpponentTeams } = useView();

  return {
    isTeamVisible: visibleTeams.some((team) => team.leagueId === teamId),
    isOpponentVisible: visibleOpponentTeams.some(
      (team) => team.leagueId === opponentId
    ),
  };
};
