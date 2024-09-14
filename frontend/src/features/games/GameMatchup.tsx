import React, { useState } from "react";
import styles from "./MatchupGuide.module.css";
import PlayerCondensed from "../players/PlayerCondensed";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import { Player } from "../nfl/nflTypes";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import {
  LuChevronDown as ChevronDown,
  LuChevronRight as ChevronRight,
} from "react-icons/lu";

interface GameMatchupProps {
  game: ProcessedGame;
}

const GameMatchup: React.FC<GameMatchupProps> = ({ game }) => {
  const [isBenchExpanded, setIsBenchExpanded] = useState(false);

  const toggleBench = () => {
    setIsBenchExpanded(!isBenchExpanded);
  };

  return (
    <div className={styles.matchup}>
      <div className={styles["matchup-header-container"]}>
        <div className={styles["matchup-header"]}>
          <div className={styles["team-names"]}>
            <span className={styles["away-team"]}>{game.awayTeam?.code}</span>
            <span className={styles["at-symbol"]}>@</span>
            <span className={styles["home-team"]}>{game.homeTeam?.code}</span>
          </div>
          <div className={styles.channel}>{game.channel}</div>
        </div>
        <div className={styles["matchup-subheader"]}>
          <div className={styles["player-count"]}>
            {game.hasPlayers ? (
              <>
                <span className={styles["self-starters"]}>
                  {game.totals.self.starters}
                </span>
                {" Player Starting"}
                {/* {" vs "}
                <span className={styles["opponent-starters"]}>
                  {game.totals.opponent.starters}
                </span>
                {` (${game.totals.self.total + game.totals.opponent.total} total)`} */}
              </>
            ) : (
              "No Players"
            )}
          </div>
        </div>
      </div>
      <hr className={styles["divider"]} />
      {game.hasPlayers ? (
        <div className={styles["team-players"]}>
          {game.starters.length > 0 && (
            <div className={styles["starters"]}>
              <div className={styles["players-wrapper"]}>
                {game.starters.map((player: Player) => (
                  <PlayerCondensed
                    key={`${player.name}-${player.team}`}
                    player={player}
                  />
                ))}
              </div>
            </div>
          )}
          {game.others.length > 0 && (
            <>
              <hr className={styles["divider"]} />
              <LinkButton
                onClick={toggleBench}
                color={LinkButtonColor.MUTED}
                underline={false}
              >
                <div className={styles["bench-button-content"]}>
                  {game.others.length} Bench Player
                  {game.others.length !== 1 ? "s" : ""}
                  {isBenchExpanded ? <ChevronDown /> : <ChevronRight />}
                </div>
              </LinkButton>
              {isBenchExpanded && (
                <div className={styles["bench"]}>
                  {game.others.map((player: Player) => (
                    <PlayerCondensed
                      key={`${player.name}-${player.team}`}
                      player={player}
                    />
                  ))}
                </div>
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
