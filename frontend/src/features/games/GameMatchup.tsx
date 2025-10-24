import React, { useState } from "react";
import styles from "./GameMatchup.module.css";
import PlayerCondensed from "../players/PlayerCondensed";
import PlayerCount from "./PlayerCount";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import { Player } from "../nfl/nflTypes";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import {
  LuChevronDown as ChevronDown,
  LuChevronRight as ChevronRight,
  LuChevronUp as ChevronUp,
} from "react-icons/lu";
import IconButton from "../../components/IconButton";
import { getMatchupColors } from "../nfl/matchupColors";
import { Stack } from "../../components/ui/Stack";

interface GameMatchupProps {
  game: ProcessedGame;
  id: string;
  onExpansionChange?: (expanded: boolean) => void;
  forceExpanded?: boolean;
}

const GameMatchup: React.FC<GameMatchupProps> = ({
  game,
  id,
  onExpansionChange,
  forceExpanded,
}) => {
  const [isBenchExpanded, setIsBenchExpanded] = useState(false);
  const [isMatchupExpanded, setIsMatchupExpanded] = useState(false);

  const gameHomeCode = game.homeTeam?.codes[0];
  const gameAwayCode = game.awayTeam?.codes[0];

  if (!gameAwayCode || !gameHomeCode) return null;

  const matchupColors = getMatchupColors([gameAwayCode, gameHomeCode]);

  const toggleBench = () => {
    setIsBenchExpanded(!isBenchExpanded);
  };

  const toggleMatchup = () => {
    const newExpandedState = !isMatchupExpanded;
    setIsMatchupExpanded(newExpandedState);
    onExpansionChange?.(newExpandedState);
  };

  // Use forceExpanded if provided (for mobile), otherwise use local state
  const actualExpandedState =
    forceExpanded !== undefined ? forceExpanded : isMatchupExpanded;

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
      className={`${styles.matchup} ${
        actualExpandedState ? "" : styles["collapsed"]
      }`}
      id={id}
    >
      <div
        className={styles["matchup-header"]}
        role="button"
        onClick={toggleMatchup}
        aria-expanded={actualExpandedState}
      >
        <div className={styles["matchup-header-left"]}>
          <div className={styles["team-names"]}>
            <div className={styles["team-names-container"]}>
              <Stack direction="row" gap={0.5} align="center">
                <h3
                  className={styles["away-team"]}
                  style={{
                    color: matchupColors?.team1.color.hex,
                    backgroundColor: matchupColors?.team1.strokeColor,
                  }}
                >
                  {gameAwayCode}
                </h3>
                <small className={styles["at-symbol"]}>vs.</small>
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
          </div>
          {actualExpandedState ? (
            <div className={styles["matchup-subheader"]}>
              {game.hasPlayers ? <PlayerCount game={game} /> : null}
            </div>
          ) : (
            <div className={styles["matchup-subheader"]}>
              {game.hasPlayers ? (
                <PlayerCount game={game} variant="collapsed" />
              ) : null}
            </div>
          )}
        </div>
        <div className={styles["matchup-header-right"]}>
          <div className={styles["schedule-info"]}>
            <IconButton
              icon={actualExpandedState ? <ChevronUp /> : <ChevronDown />}
              onClick={toggleMatchup}
              color="clear"
            />
            {actualExpandedState && (
              <>
                <p className={styles.channel}>{game.channel}</p>
                <p className={styles.date}>{formattedDate}</p>
              </>
            )}
          </div>
        </div>
      </div>
      {actualExpandedState && (
        <div className={styles["matchup-content"]}>
          {game.hasPlayers ? (
            <div className={styles["team-players"]}>
              {game.awayPlayers.starters.length > 0 && (
                <div className={styles["players-wrapper"]}>
                  <h4>{gameAwayCode}</h4>
                  <div className={styles["team-players-header-container"]}>
                    <div className={styles["team-players-header"]}>
                      <h6>Pos</h6>
                      <h6>Name</h6>
                      <h6>Own</h6>
                      <h6>Against</h6>
                    </div>
                  </div>
                  {game.awayPlayers.starters.map((player: Player) => (
                    <PlayerCondensed
                      key={`${player.name}-${player.team}`}
                      player={player}
                      slotTypes={["start", "bestBall"]}
                    />
                  ))}
                </div>
              )}
              {game.homePlayers.starters.length > 0 && (
                <div className={styles["players-wrapper"]}>
                  <h4>{gameHomeCode}</h4>
                  <div className={styles["team-players-header-container"]}>
                    <div className={styles["team-players-header"]}>
                      <h6>Pos</h6>
                      <h6>Name</h6>
                      <h6>Own</h6>
                      <h6>Against</h6>
                    </div>
                  </div>
                  {game.homePlayers.starters.map((player: Player) => (
                    <PlayerCondensed
                      key={`${player.name}-${player.team}-${player.position}`}
                      player={player}
                      slotTypes={["start", "bestBall"]}
                    />
                  ))}
                </div>
              )}
              {game.others.length > 0 && (
                <>
                  <LinkButton
                    onClick={toggleBench}
                    color={LinkButtonColor.MUTED}
                    underline={false}
                  >
                    <div className={styles["bench-button-content"]}>
                      {game.totals.self.bench} Bench Player
                      {game.totals.self.bench !== 1 ? "s" : ""}
                      {isBenchExpanded ? <ChevronDown /> : <ChevronRight />}
                    </div>
                  </LinkButton>
                  {isBenchExpanded && (
                    <>
                      {game.awayPlayers.others.length > 0 && (
                        <div className={styles["players-wrapper"]}>
                          <h4>{gameAwayCode}</h4>
                          <div
                            className={styles["team-players-header-container"]}
                          >
                            <div className={styles["team-players-header"]}>
                              <h6>Pos</h6>
                              <h6>Name</h6>
                              <h6>Own</h6>
                              <h6>Against</h6>
                            </div>
                          </div>
                          {game.awayPlayers.others.map((player: Player) => (
                            <PlayerCondensed
                              key={`${player.name}-${player.team}`}
                              player={player}
                              slotTypes={["bench"]}
                            />
                          ))}
                        </div>
                      )}
                      {game.homePlayers.others.length > 0 && (
                        <div className={styles["players-wrapper"]}>
                          <h4>{gameHomeCode}</h4>
                          <div
                            className={styles["team-players-header-container"]}
                          >
                            <div className={styles["team-players-header"]}>
                              <h6>Pos</h6>
                              <h6>Name</h6>
                              <h6>Own</h6>
                            </div>
                          </div>
                          {game.homePlayers.others.map((player: Player) => (
                            <PlayerCondensed
                              key={`${player.name}-${player.team}`}
                              player={player}
                              slotTypes={["bench"]}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              <div className={styles.cardFooter}>
                <small>* Best Ball</small>
              </div>
            </div>
          ) : (
            <p className={styles["no-players"]}>No fantasy players</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameMatchup;
