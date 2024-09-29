import React, { useState } from "react";
import styles from "./MatchupGuide.module.css";
import GameMatchup from "./GameMatchup";
import { ProcessedGameBucket } from "../../hooks/useProcessedSchedule";
import { LuChevronDown } from "react-icons/lu"; // Example icons

interface GameBucketGroupProps {
  status: string;
  gameBuckets: ProcessedGameBucket[];
}

const GameBucketGroup: React.FC<GameBucketGroupProps> = ({
  status,
  gameBuckets,
}) => {
  const [collapsedBuckets, setCollapsedBuckets] = useState<boolean[]>(
    gameBuckets.map((_) => status === "completed")
  );

  const toggleCollapse = (index: number) => {
    setCollapsedBuckets((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div key={status} className={styles["game-group"]}>
      {gameBuckets.map((bucket: ProcessedGameBucket, bucketIndex: number) => (
        <div key={`${status}-${bucketIndex}`} className={styles["game-bucket"]}>
          <div
            className={styles["bucket-header"]}
            onClick={() => toggleCollapse(bucketIndex)}
            aria-label={`Toggle ${bucket.day} ${bucket.startingHour} games`}
          >
            <h4>
              {bucket.day} {bucket.startingHour}
            </h4>
            <LuChevronDown
              color="var(--text-color)"
              className={`${styles["collapse-icon"]} ${
                collapsedBuckets[bucketIndex] ? styles["collapsed"] : ""
              }`}
            />
          </div>
          {!collapsedBuckets[bucketIndex] && (
            <div className={styles["game-group-content"]}>
              {bucket.games.map((game, gameIndex) => (
                <GameMatchup
                  key={`${status}-${bucketIndex}-${gameIndex}`}
                  game={game}
                  id={`matchup-${game.awayTeam?.code}-${game.homeTeam?.code}`}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBucketGroup;
