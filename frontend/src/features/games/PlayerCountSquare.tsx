import React from "react";
import styles from "./PlayerCountSquare.module.css";
import { LuFlame as Flame } from "react-icons/lu";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import { Stack } from "../../components/ui/Stack";

interface PlayerCountProps {
  game: ProcessedGame;
  variant?: "expanded" | "collapsed";
}

const PlayerCount: React.FC<PlayerCountProps> = ({
  game,
  variant = "expanded",
}) => {
  return (
    <div
      className={`${styles["player-count"]} ${styles[variant]} ${
        game.isTopGame ? styles["top-game"] : ""
      }`}
    >
      <Stack direction="row" gap={0.5} align="center">
        <Stack align="center" justify="center" gap={0.25}>
          <h4>You</h4>
          <div
            className={`${styles["starters"]} ${
              game.starters.length === 0 ? styles["starters-none"] : ""
            }`}
          >
            {game.totals.self.starters}
          </div>
        </Stack>
        {game.isTopGame ? (
          <Flame size={18} color="var(--color-yellow)" />
        ) : (
          <small className={styles["vs"]}>vs.</small>
        )}
        <Stack align="center" justify="center" gap={0.25}>
          <h4>Opp</h4>
          <div
            className={`${styles["starters"]} ${
              game.starters.length === 0 ? styles["starters-none"] : ""
            }`}
          >
            {game.totals.opponent.starters}
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default PlayerCount;
