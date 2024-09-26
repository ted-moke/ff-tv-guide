import React from "react";
import styles from "./MatchupGuide.module.css";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

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
      {matchupPlayers && <h2>NFL Week {matchupPlayers.weekNumber}</h2>}

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
