import { Checkbox } from "../../components/ui/Checkbox";
import { Stack } from "../../components/ui/Stack";
import { FantasyTeam } from "./teamTypes";

export const FantasyTeamOption = ({
  team,
  isVisible,
  isOpponentVisible,
  showTeam,
  hideTeam,
  showOpponentTeam,
  hideOpponentTeam,
}: {
  team: FantasyTeam;
  isVisible: boolean;
  isOpponentVisible: boolean;
  showTeam: (leagueId: string) => void;
  hideTeam: (leagueId: string) => void;
  showOpponentTeam: (leagueId: string) => void;
  hideOpponentTeam: (leagueId: string) => void;
}) => {
  return (
    <Stack direction="row" key={team.leagueId}>
      <Checkbox
        key={`${team.leagueId}-opponent`}
        id={`${team.leagueId}-opponent`}
        checked={isOpponentVisible}
        onChange={() =>
          isOpponentVisible
            ? showOpponentTeam(team.leagueId)
            : hideOpponentTeam(team.leagueId)
        }
      />
      <Checkbox
        key={team.leagueId}
        id={team.leagueId}
        checked={isVisible}
        onChange={() =>
          isVisible ? showTeam(team.leagueId) : hideTeam(team.leagueId)
        }
        label={`${team.leagueName}`}
      />
    </Stack>
  );
};
