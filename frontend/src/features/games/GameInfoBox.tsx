import React from "react";
import styles from "./GameInfoBox.module.css";

interface GameInfoBoxProps {
  awayCode: string;
  homeCode: string;
  time: string;
  day?: string;
  starters: number;
  opponentStarters: number;
  isTopGame: boolean;
}

const GameInfoBox: React.FC<GameInfoBoxProps> = ({
  awayCode,
  homeCode,
  time,
  day,
  starters,
  opponentStarters,
  isTopGame,
}) => {
  return (
    <div className={`${styles.box} ${isTopGame ? styles.topGame : ""}`}>
      <div className={styles.row}>
        <div className={styles.awayCode}>{awayCode}</div>
        <div className={styles.starters}>
          {starters} vs {opponentStarters}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.homeCode}>{homeCode}</div>
        <div className={styles.time}>
          {day && `${day} `} {time}
        </div>
      </div>
    </div>
  );
};

export default GameInfoBox;
