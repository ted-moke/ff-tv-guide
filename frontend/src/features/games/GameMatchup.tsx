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
} from "react-icons/lu";

interface GameMatchupProps {
  game: ProcessedGame;
}

const GameMatchup: React.FC<GameMatchupProps> = ({ game }) => {
  const [isBenchExpanded, setIsBenchExpanded] = useState(false);

  const toggleBench = () => {
    setIsBenchExpanded(!isBenchExpanded);
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
    <div className={styles.matchup}>
      <div className={styles["matchup-header-container"]}>
        <div className={styles["matchup-header"]}>
          <div className={styles["team-names"]}>
            <h3 className={styles["away-team"]}>{game.awayTeam?.code}</h3>
            <h3 className={styles["at-symbol"]}>@</h3>
            <h3 className={styles["home-team"]}>{game.homeTeam?.code}</h3>
          </div>
          <div className={styles["matchup-header-right"]}>
            <p className={styles.channel}>{game.channel}</p>
            <p className={styles.date}>{formattedDate}</p>
          </div>
        </div>
        <div className={styles["matchup-subheader"]}>
          {game.hasPlayers ? (
            <div
              className={`${styles["player-count"]} ${
                game.isTopGame ? styles["top-game"] : ""
              }`}
            >
              <div>You:</div>
              <div
                className={`${styles["self-starters"]} ${
                  game.starters.length === 0 ? styles["starters-none"] : ""
                }`}
              >
                {game.totals.self.starters}
              </div>
              {/* <div>
                {"  Starter"}
                {game.totals.self.starters !== 1 ? "s " : " "}
              </div> */}
              <div>vs</div>
              <div
                className={`${styles["self-starters"]} ${
                  game.starters.length === 0 ? styles["starters-none"] : ""
                }`}
              >
                {game.totals.opponent.starters}
              </div>
              <div>Opponent</div>
              {game.isTopGame && (
                <div className={styles["top-game-badge"]}>
                  <Flame size={20} />
                </div>
              )}
            </div>
          ) : (
            <div>"No Players"</div>
          )}
        </div>
      </div>
      <hr className={styles["divider"]} />
      {game.hasPlayers ? (
        <div className={styles["team-players"]}>
          {game.awayPlayers.starters.length > 0 && (
            <div className={styles["players-wrapper"]}>
              <h4>{game.awayTeam?.code}</h4>
              <div className={styles["team-players-header-container"]}>
                <div className={styles["team-players-header"]}>
                  <h5>Pos</h5>
                  <h5>Name</h5>
                  <h5>Mine</h5>
                  <h5>Against</h5>
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
              <h4>{game.homeTeam?.code}</h4>
              <div className={styles["team-players-header-container"]}>
                <div className={styles["team-players-header"]}>
                  <h5>Pos</h5>
                  <h5>Name</h5>
                  <h5>Mine</h5>
                  <h5>Against</h5>
                </div>
              </div>
              {game.homePlayers.starters.map((player: Player) => (
                <PlayerCondensed
                  key={`${player.name}-${player.team}`}
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
                      <h4>{game.awayTeam?.code}</h4>
                      <div className={styles["team-players-header-container"]}>
                        <div className={styles["team-players-header"]}>
                          <h5>Pos</h5>
                          <h5>Name</h5>
                          <h5>Mine</h5>
                          <h5>Against</h5>
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
                      <h4>{game.homeTeam?.code}</h4>
                      <div className={styles["team-players-header-container"]}>
                        <div className={styles["team-players-header"]}>
                          <h5>Pos</h5>
                          <h5>Name</h5>
                          <h5>Mine</h5>
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
    </div>
  );
};

export default GameMatchup;
