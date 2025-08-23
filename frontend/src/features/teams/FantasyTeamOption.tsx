import { MdClose } from "react-icons/md";
import IconButton from "../../components/IconButton";
import Checkbox from "../../components/ui/Checkbox";
import LinkButton from "../../components/ui/LinkButton";
import { Stack } from "../../components/ui/Stack";
import { FantasyTeam } from "./teamTypes";
import RadioButton from "../../components/ui/RadioButton";
import styles from "./FantasyTeamOptions.module.css";

export const FantasyTeamOption = ({
  team,
  isVisible,
  isOpponentVisible,
  showTeam,
  hideTeam,
  showOpponentTeam,
  hideOpponentTeam,
  selected,
  handleClick,
}: {
  team: FantasyTeam;
  isVisible: boolean;
  isOpponentVisible: boolean;
  showTeam: (leagueId: string) => void;
  hideTeam: (leagueId: string) => void;
  showOpponentTeam: (leagueId: string) => void;
  hideOpponentTeam: (leagueId: string) => void;
  selected: boolean;
  handleClick: () => void;
}) => {
  const allVisible = isVisible && isOpponentVisible;
  const allHidden = !isVisible && !isOpponentVisible;
  const opponentHidden = isVisible && !isOpponentVisible;

  if (!selected) {
    return (
      <div style={{ cursor: "pointer" }} onClick={handleClick}>
        <Stack direction="row" align="center">
          <p className={styles["fantasy-team-item"]}>{team.leagueName}</p>
          {allHidden && <small className="muted">Hidden</small>}
          {opponentHidden && <small className="muted">Team Only</small>}
        </Stack>
      </div>
    );
  }

  const handleShowAll = () => {
    showTeam(team.leagueId);
    showOpponentTeam(team.leagueId);
  };

  const handleHideOpponent = () => {
    hideOpponentTeam(team.leagueId);
    showTeam(team.leagueId);
  };

  const handleHideAll = () => {
    hideTeam(team.leagueId);
    hideOpponentTeam(team.leagueId);
  };

  return (
    <Stack>
      <Stack direction="row" key={team.leagueId} gap={1} align="center">
        <IconButton icon={<MdClose />} onClick={handleClick} />
        <p>{team.leagueName}</p>
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
