import React, { useState } from "react";
import styles from "./GameBucketGroup.module.css";
import GameMatchup from "./GameMatchup";
import { ProcessedGameBucket } from "../../hooks/useProcessedSchedule";
import { LuChevronDown } from "react-icons/lu"; // Example icons
import { useView } from "../view/ViewContext";

interface GameBucketGroupProps {
  status: string;
  gameBuckets: ProcessedGameBucket[];
}

const GameBucketGroup: React.FC<GameBucketGroupProps> = ({
  status,
  gameBuckets,
}) => {
  const { isMobile } = useView();
  const [collapsedBuckets, setCollapsedBuckets] = useState<boolean[]>(
    gameBuckets.map((_) => status === "completed")
  );
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

  const toggleCollapse = (index: number) => {
    setCollapsedBuckets((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleGameExpansion = (gameId: string, isExpanded: boolean) => {
    if (isMobile) {
      setExpandedGameId(isExpanded ? gameId : null);
    }
  };

  const getGridPosition = (gameIndex: number, selectedIndex: number | null) => {
    if (!isMobile || selectedIndex === null) {
      return ""; // Use default grid positioning
    }

    if (gameIndex === selectedIndex) {
      return styles.selected;
    }

    // For non-selected games, just alternate left/right
    // Let CSS Grid handle the row placement automatically
    return gameIndex % 2 === 0 ? styles.aboveSelectedL : styles.aboveSelectedR;
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
              NFL {bucket.day} {bucket.startingHour}{" "}
              {bucket.games.length > 1
                ? "- " + bucket.games.length + " games"
                : ""}
            </h4>
            <LuChevronDown
              color="var(--text-color-muted)"
              className={`${styles["collapse-icon"]} ${
                collapsedBuckets[bucketIndex] ? styles["collapsed"] : ""
              }`}
            />
          </div>
          {!collapsedBuckets[bucketIndex] && (
            <div
              className={`${styles["game-group-content"]} ${
                bucket.games.length === 1 ? styles["one-game"] : ""
              }`}
            >
              {bucket.games.map((game, gameIndex) => {
                const gameId = `matchup-${game.awayTeam?.codes[0]}-${game.homeTeam?.codes[0]}`;
                const isExpanded = isMobile ? expandedGameId === gameId : true;
                const selectedIndex =
                  isMobile && expandedGameId
                    ? bucket.games.findIndex(
                        (g) =>
                          `matchup-${g.awayTeam?.codes[0]}-${g.homeTeam?.codes[0]}` ===
                          expandedGameId
                      )
                    : null;
                const gridPosition = getGridPosition(gameIndex, selectedIndex);

                return (
                  <div
                    key={`${status}-${bucketIndex}-${gameIndex}`}
                    className={gridPosition}
                  >
                    <GameMatchup
                      game={game}
                      id={gameId}
                      onExpansionChange={(expanded) =>
                        handleGameExpansion(gameId, expanded)
                      }
                      forceExpanded={isMobile ? isExpanded : undefined}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBucketGroup;
