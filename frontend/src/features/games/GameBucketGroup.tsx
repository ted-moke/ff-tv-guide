import React, { useState } from 'react';
import styles from './MatchupGuide.module.css';
import GameMatchup from './GameMatchup';
import { ProcessedGameBucket } from '../../hooks/useProcessedSchedule';
import IconButton from '../../components/IconButton';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'; // Example icons

interface GameBucketGroupProps {
  status: string;
  gameBuckets: ProcessedGameBucket[];
}

const GameBucketGroup: React.FC<GameBucketGroupProps> = ({ status, gameBuckets }) => {
  const [collapsedBuckets, setCollapsedBuckets] = useState<boolean[]>(gameBuckets.map(_ => status === 'completed'));

  const toggleCollapse = (index: number) => {
    setCollapsedBuckets(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div key={status} className={styles["game-group"]}>
      {gameBuckets.map((bucket: ProcessedGameBucket, bucketIndex: number) => (
        <div key={`${status}-${bucketIndex}`} className={styles["game-bucket"]}>
          <div className={styles["divider"]} />
          <div className={styles["bucket-header"]}>
            <h4>{bucket.day} - {bucket.startingHour}</h4>
            <IconButton
              icon={collapsedBuckets[bucketIndex] ? <LuChevronDown color="var(--text-color)" /> : <LuChevronUp color="var(--text-color)" />}
              onClick={() => toggleCollapse(bucketIndex)}
              className={styles["collapse-button"]}
            />
          </div>
          {!collapsedBuckets[bucketIndex] && (
            <div className={styles["game-group-content"]}>
              {bucket.games.map((game, gameIndex) => (
                <GameMatchup key={`${status}-${bucketIndex}-${gameIndex}`} game={game} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBucketGroup;