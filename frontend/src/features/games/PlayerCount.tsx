import React from "react";
import styles from "./PlayerCount.module.css";
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
      <h4>You:</h4>
      <Stack direction="row" gap={0.5} align="center">
        <div
          className={`${styles["starters"]} ${
            game.starters.length === 0 ? styles["starters-none"] : ""
          }`}
        >
          {game.totals.self.starters}
        </div>
        {game.isTopGame ? (
          <Flame size={18} color="var(--color-yellow)" />
        ) : (
          <small className={styles["vs"]}>vs.</small>
        )}
        <div
          className={`${styles["starters"]} ${
            game.starters.length === 0 ? styles["starters-none"] : ""
          }`}
        >
          {game.totals.opponent.starters}
        </div>
      </Stack>
      <h4>Opp</h4>
    </div>
  );
};

export default PlayerCount;
