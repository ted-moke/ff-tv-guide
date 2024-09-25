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
      {showNewFeatureAlert && (
        <div style={{ maxWidth: "600px", margin: "8px auto" }}>
          <Alert buttonText="Dismiss" onButtonClick={handleDismissAlert}>
            <div>
              <h4 style={{ marginBottom: "8px" }}>
                New features for NFL Week 3
              </h4>
              <ul
                style={{
                  listStyle: "disc",
                  padding: "var(--size1)",
                  margin: "0 0 0 var(--size3)",
                }}
              >
                <li style={{ marginBottom: "0.5rem", listStyle: "disc" }}>
                  <p>See your which players your opponents have.</p>
                </li>
                <li style={{ marginBottom: "0.5rem", listStyle: "disc" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img src={logoFF} width={20} />
                    <p>Fleaflicker integration</p>
                  </div>
                </li>
              </ul>
            </div>
          </Alert>
        </div>
      )}
      <h2>NFL Week {matchupPlayers.weekNumber}</h2>

      {Object.entries(matchupPlayers.games)
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
