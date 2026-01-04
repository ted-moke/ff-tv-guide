import React from "react";
import styles from "./GameMatchupHeader2.module.css";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import {
  LuChevronDown as ChevronDown,
  LuChevronUp as ChevronUp,
} from "react-icons/lu";
import IconButton from "../../components/IconButton";
import { getMatchupColors } from "../nfl/matchupColors";
import { Stack } from "../../components/ui/Stack";
import { useView } from "../view/ViewContext";
import PlayerCount from "./PlayerCount";
import PlayerCountSquare from "./PlayerCountSquare";

interface GameMatchupHeaderProps {
  game: ProcessedGame;
  isExpanded: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
}

const GameMatchupHeader: React.FC<GameMatchupHeaderProps> = ({
  game,
  isExpanded,
  onToggle,
  isCollapsed = false,
}) => {
  const { isMobile } = useView();
  const gameHomeCode = game.homeTeam?.codes[0];
  const gameAwayCode = game.awayTeam?.codes[0];

  if (!gameAwayCode || !gameHomeCode) return null;

  const matchupColors = getMatchupColors([gameAwayCode, gameHomeCode]);

  // take date and time from bucket, assume the listed time is in EDT, and format it in the users time zone like "12:00 PM"
  const formattedDate = new Date(`${game.date}T${game.time}`).toLocaleString(
    "en-US",
    {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );

  return (
    <div
      className={`${styles["matchup-header"]} ${
        isCollapsed ? styles["collapsed"] : ""
      }`}
      role="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      <div className={styles["team-names"]}>
        <Stack gap={0.25} align="center">
          <h3
            className={styles["away-team"]}
            style={{
              color: matchupColors?.team1.color.hex,
              backgroundColor: matchupColors?.team1.strokeColor,
            }}
          >
            {gameAwayCode}
          </h3>
          <h3
            className={styles["home-team"]}
            style={{
              color: matchupColors?.team2.color.hex,
              backgroundColor: matchupColors?.team2.strokeColor,
            }}
          >
            {gameHomeCode}
          </h3>
        </Stack>
      </div>
      {isExpanded ? (
        <div className={styles["matchup-subheader"]}>
          {game.hasPlayers ? (
            isMobile ? (
              <PlayerCountSquare game={game} variant="expanded" />
            ) : (
              <PlayerCount game={game} variant="expanded" />
            )
          ) : null}
        </div>
      ) : (
        <div className={styles["matchup-subheader"]}>
          {game.hasPlayers ? (
            isMobile ? (
              <PlayerCountSquare game={game} variant="collapsed" />
            ) : (
              <PlayerCount game={game} variant="collapsed" />
            )
          ) : <div className={styles.noPlayers}>No players</div>}
        </div>
      )}

      <div className={styles["schedule-info"]}>
        <Stack gap={0.25} align="end" justify="center">
          <p className={styles.channel}>{game.channel}</p>
          <p className={styles.date}>{formattedDate}</p>
        </Stack>
        <IconButton
          icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
          onClick={onToggle}
          color="clear"
          className={styles["expand-button"]}
        />
      </div>
    </div>
  );
};

export default GameMatchupHeader;
