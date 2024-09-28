import React, { useRef } from "react";
import styles from "./MatchupGuide.module.css";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import GameInfoBox from "./GameInfoBox";
import { format24HourTo12Hour } from "../../utils/timeUtils";
import { formatDateToDay } from "../../utils/dateUtils";
import { LuArrowBigLeft, LuArrowBigRight } from "react-icons/lu";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const carouselRef = useRef<HTMLDivElement>(null);

  const { hasPlayers, matchupPlayers, isLoading, initialized, error } =
    useMatchupPlayers(selectedWeek);

  if (isAuthLoading) return <LoadingSpinner />;
  if (!user) {
    return <Navigate to="/connect-team" />;
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  if (!matchupPlayers && initialized) {
    return <div>No games scheduled for this week.</div>;
  }

  if (!hasPlayers) {
    return <Navigate to="/connect-team" />;
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className={`${styles["matchup-guide"]} page-container`}>
      {matchupPlayers && (
        <div className={styles.header}>
            <h2>NFL Week {matchupPlayers.weekNumber}</h2>
        </div>
      )}

      {matchupPlayers && (
        <div className={styles.carouselContainer}>
          <button onClick={scrollLeft} className={styles.carouselButton}>
            <LuArrowBigLeft />
          </button>
          <div className={styles.carousel} ref={carouselRef}>
            {Object.values(matchupPlayers.games)
              .flat()
              .map((bucket) =>
                bucket.games.map((game) => (
                  <GameInfoBox
                    key={`${game.awayTeam?.code}-${game.homeTeam?.code}`}
                    awayCode={game.awayTeam?.code || ""}
                    homeCode={game.homeTeam?.code || ""}
                    time={format24HourTo12Hour(game.time)}
                    day={formatDateToDay(game.date)}
                    starters={game.totals.self.starters}
                    opponentStarters={game.totals.opponent.starters}
                    isTopGame={game.isTopGame}
                  />
                ))
              )}
          </div>
          <button onClick={scrollRight} className={styles.carouselButton}>
            <LuArrowBigRight />
          </button>
        </div>
      )}

      {matchupPlayers &&
        Object.entries(matchupPlayers.games)
          .filter(([_, gameBuckets]) => gameBuckets.length > 0)
          .map(([status, gameBuckets]) => (
            <GameBucketGroup
              key={status}
              status={status}
              gameBuckets={gameBuckets}
            />
          ))}
    </div>
  );
};

export default MatchupGuide;
