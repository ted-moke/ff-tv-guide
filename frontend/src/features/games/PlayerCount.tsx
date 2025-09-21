import React from "react";
import styles from "./PlayerCount.module.css";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";

interface PlayerCountProps {
  game: ProcessedGame;
  variant?: "expanded" | "collapsed";
}

const PlayerCount: React.FC<PlayerCountProps> = ({ game, variant = "expanded" }) => {
  return (
    <div
      className={`${styles["player-count"]} ${styles[variant]} ${
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
      <h4 className={styles["vs"]}>VS</h4>
      <div
        className={`${styles["starters"]} ${
          game.starters.length === 0 ? styles["starters-none"] : ""
        }`}
      >
        {game.totals.opponent.starters}
      </div>
      <h4>Opp</h4>
    </div>
  );
};

export default PlayerCount;
