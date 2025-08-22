import React, { useState } from "react";
import styles from "./GameMatchup.module.css";
import PlayerCondensed from "../players/PlayerCondensed";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import { Player } from "../nfl/nflTypes";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import {
  LuChevronDown as ChevronDown,
  LuChevronRight as ChevronRight,
  LuFlame as Flame,
  LuChevronUp as ChevronUp,
} from "react-icons/lu";
import IconButton from "../../components/IconButton";

interface GameMatchupProps {
  game: ProcessedGame;
  id: string;
}

const GameMatchup: React.FC<GameMatchupProps> = ({ game, id }) => {
  const [isBenchExpanded, setIsBenchExpanded] = useState(false);
  const [isMatchupExpanded, setIsMatchupExpanded] = useState(true);

  const toggleBench = () => {
    setIsBenchExpanded(!isBenchExpanded);
  };

  const toggleMatchup = () => {
    setIsMatchupExpanded(!isMatchupExpanded);
  };

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
        isMatchupExpanded ? "" : styles["collapsed"]
      }`}
      id={id}
    >
      <div
        className={styles["matchup-header"]}
        role="button"
        onClick={toggleMatchup}
        aria-expanded={isMatchupExpanded}
      >
        <div className={styles["matchup-header-left"]}>
          <div className={styles["team-names"]}>
            <div className={styles["team-names-container"]}>
              <h3 className={styles["away-team"]}>{game.awayTeam?.codes[0]}</h3>
              <h3 className={styles["at-symbol"]}>@</h3>
              <h3 className={styles["home-team"]}>{game.homeTeam?.codes[0]}</h3>
              {game.isTopGame && (
                <div className={styles["top-game-badge"]}>
                  <Flame size={20} />
                </div>
              )}
            </div>
          </div>
          {isMatchupExpanded && (
            <div className={styles["matchup-subheader"]}>
              {game.hasPlayers ? (
                <div
                  className={`${styles["player-count"]} ${
                    game.isTopGame ? styles["top-game"] : ""
                  }`}
                >
                  <h4>You:</h4>
                  <div
                    className={`${styles["starters"]} ${
                      game.starters.length === 0 ? styles["starters-none"] : ""
                    }`}
                  >
                    {game.totals.self.starters}
                  </div>
                  <h4 className={styles["vs"]}>vs</h4>
                  <div
                    className={`${styles["starters"]} ${
                      game.starters.length === 0 ? styles["starters-none"] : ""
                    }`}
                  >
                    {game.totals.opponent.starters}
                  </div>
                  <h4>Opponent</h4>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div className={styles["matchup-header-right"]}>
          <div className={styles["schedule-info"]}>
            <IconButton
              icon={isMatchupExpanded ? <ChevronUp /> : <ChevronDown />}
              onClick={toggleMatchup}
              color="clear"
            />
            {isMatchupExpanded && (
              <>
                <p className={styles.channel}>{game.channel}</p>
                <p className={styles.date}>{formattedDate}</p>
              </>
            )}
          </div>
        </div>
      </div>
      {isMatchupExpanded && (
        <>
          <hr className={styles["divider"]} />
          {game.hasPlayers ? (
            <div className={styles["team-players"]}>
              {game.awayPlayers.starters.length > 0 && (
                <div className={styles["players-wrapper"]}>
                  <h4>{game.awayTeam?.codes[0]}</h4>
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
                      slotType="start"
                    />
                  ))}
                </div>
              )}
              {game.homePlayers.starters.length > 0 && (
                <div className={styles["players-wrapper"]}>
                  <h4>{game.homeTeam?.codes[0]}</h4>
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
                      slotType="start"
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
                          <h4>{game.awayTeam?.codes[0]}</h4>
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
                              slotType="bench"
                            />
                          ))}
                        </div>
                      )}
                      {game.homePlayers.others.length > 0 && (
                        <div className={styles["players-wrapper"]}>
                          <h4>{game.homeTeam?.codes[0]}</h4>
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
                              slotType="bench"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className={styles["no-players"]}>No fantasy players</p>
          )}
        </>
      )}
    </div>
  );
};

export default GameMatchup;
