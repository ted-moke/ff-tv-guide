import React, { useState } from "react";
import styles from "./MatchupGuide.module.css";
import Alert from "../../components/ui/Alert";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import logoFF from "../../assets/logo-ff.png";
import { useAuth } from "../auth/useAuth";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const alertDismissed = localStorage.getItem("newFeatureAlertDismissed");

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const [showNewFeatureAlert, setShowNewFeatureAlert] = useState(
    alertDismissed === "true" ? false : true
  );
  const { user, isLoading: isAuthLoading } = useAuth();

  const { hasPlayers, matchupPlayers, isLoading, initialized, error } =
    useMatchupPlayers(selectedWeek);

  const handleDismissAlert = () => {
    setShowNewFeatureAlert(false);
    localStorage.setItem("newFeatureAlertDismissed", "true");
  };

  if (isAuthLoading) return <LoadingSpinner />;
  if (!user) {
    console.log("no user");
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
