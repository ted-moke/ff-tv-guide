import { MdClose } from "react-icons/md";
import { Stack } from "../../components/ui/Stack";
import { FantasyTeam } from "./teamTypes";
import RadioButton from "../../components/ui/RadioButton";
import styles from "./FantasyTeamOption.module.css";

const isDev = process.env.NODE_ENV === "development";

export const FantasyTeamOption = ({
  team,
  isVisible,
  isOpponentVisible,
  showTeam,
  hideTeam,
  showOpponentTeam,
  hideOpponentTeam,
  selected,
  handleToggleLeagueSelected,
}: {
  team: FantasyTeam;
  isVisible: boolean;
  isOpponentVisible: boolean;
  showTeam: (leagueId: string) => void;
  hideTeam: (leagueId: string) => void;
  showOpponentTeam: (leagueId: string) => void;
  hideOpponentTeam: (leagueId: string) => void;
  selected: boolean;
  handleToggleLeagueSelected: () => void;
}) => {
  const allVisible = isVisible && isOpponentVisible;
  const allHidden = !isVisible && !isOpponentVisible;
  const opponentHidden = isVisible && !isOpponentVisible;
  const opponentOnly = !isVisible && isOpponentVisible;

  if (!selected) {
    return (
      <div
        className={styles["fantasy-team-item"]}
        onClick={handleToggleLeagueSelected}
      >
        <Stack direction="row" align="center" justify="between">
            <p>{team.leagueName}</p>
          {allHidden && <small className="muted">Hidden</small>}
          {opponentOnly && <small className="muted">Opponent Only</small>}
          {opponentHidden && <small className="muted">Team Only</small>}
        </Stack>
      </div>
    );
  }

  const handleShowAll = () => {
    showOpponentTeam(team.leagueId);
    showTeam(team.leagueId);
    handleToggleLeagueSelected();
  };

  const handleHideOpponent = () => {
    hideOpponentTeam(team.leagueId);
    showTeam(team.leagueId);
    handleToggleLeagueSelected();
  };

  const handleHideAll = () => {
    hideOpponentTeam(team.leagueId);
    hideTeam(team.leagueId);
    handleToggleLeagueSelected();
  };

  console.log("team", team);

  return (
    <Stack>
      <Stack
        direction="row"
        key={team.leagueId}
        gap={1}
        align="center"
        onClick={handleToggleLeagueSelected}
        className={styles["fantasy-team-item"]}
      >
        <p>{team.leagueName}</p>
        <MdClose />
      </Stack>
      <RadioButton
        id="show-all"
        name="show-all"
        value="show-all"
        label="Show All"
        checked={allVisible}
        onChange={handleShowAll}
      />
      <RadioButton
        id="hide-opponent"
        name="hide-opponent"
        value="hide-opponent"
        label="Hide Opponent"
        checked={opponentHidden}
        onChange={handleHideOpponent}
      />
      <RadioButton
        id="hide-all"
        name="hide-all"
        value="hide-all"
        label="Hide All"
        checked={allHidden}
        onChange={handleHideAll}
      />
    </Stack>
  );
};
