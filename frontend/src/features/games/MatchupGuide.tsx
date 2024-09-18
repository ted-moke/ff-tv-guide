import React, { useState } from "react";
import styles from "./MatchupGuide.module.css";
import Alert from "../../components/ui/Alert";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import logoFF from "../../assets/logo-ff.png";
import LinkButton from "../../components/ui/LinkButton";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const alertDismissed = localStorage.getItem("newFeatureAlertDismissed");

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const navigate = useNavigate();
  const [showNewFeatureAlert, setShowNewFeatureAlert] = useState(
    alertDismissed === "true" ? false : true
  );

  const { hasPlayers, matchupPlayers, isLoading, error } =
    useMatchupPlayers(selectedWeek);

  const handleDismissAlert = () => {
    setShowNewFeatureAlert(false);
    localStorage.setItem("newFeatureAlertDismissed", "true");
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  if (!matchupPlayers) {
    return <div>No games scheduled for this week.</div>;
  }

  if (!hasPlayers) {
    return (
      <div className={styles["no-teams"]}>
        <Alert
          message="It looks like you haven't connected any leagues yet. Connect a league to view your matchups."
          buttonText="Connect a League"
          onButtonClick={() => navigate("/connect-team")}
        />
      </div>
    );
  }

  return (
    <div className={`${styles["matchup-guide"]} page-container`}>
      {showNewFeatureAlert && (
        <div style={{ maxWidth: "600px", margin: "8px auto" }}>
          <Alert buttonText="Dismiss" onButtonClick={handleDismissAlert}>
            <div>
              <h4 style={{ marginBottom: "8px" }}>New features for Week 3</h4>
              <ul style={{ margin: "0" }}>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img src={logoFF} width={20} />
                    <p>Fleaflicker integration!! <LinkButton to="/connect-team">Connect a league now</LinkButton></p>
                    
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
