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
import MatchupCarousel from "./MatchupCarousel";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { user, isLoading: isAuthLoading } = useAuthContext();

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

  return (
    <div className={`${styles["matchup-guide"]} page-container`}>
      {matchupPlayers && (
        <div className={styles.header}>
            <h2>NFL Week {matchupPlayers.weekNumber}</h2>
        </div>
      )}

      {matchupPlayers && (
        <MatchupCarousel
          games={Object.values(matchupPlayers.games).flat().flatMap(bucket => bucket.games)}
        />
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
