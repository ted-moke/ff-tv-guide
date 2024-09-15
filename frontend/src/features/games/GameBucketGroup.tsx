import React from 'react';
import styles from './MatchupGuide.module.css';
import GameMatchup from './GameMatchup';
import { ProcessedGameBucket } from '../../hooks/useProcessedSchedule';

interface GameBucketGroupProps {
  status: string;
  gameBuckets: ProcessedGameBucket[];
}

const GameBucketGroup: React.FC<GameBucketGroupProps> = ({ status, gameBuckets }) => {
  return (
    <div key={status} className={styles["game-group"]}>
      {gameBuckets.map((bucket: ProcessedGameBucket, bucketIndex: number) => (
        <div key={`${status}-${bucketIndex}`} className={styles["game-bucket"]}>
          <div className={styles["divider"]} />
          <h4>{bucket.day} - {bucket.startingHour}</h4>
          <div className={styles["game-group-content"]}>
            {bucket.games.map((game, gameIndex) => (
              <GameMatchup key={`${status}-${bucketIndex}-${gameIndex}`} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameBucketGroup;