import React, { useState } from "react";
import styles from "./MatchupGuide.module.css";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import MatchupCarousel from "./MatchupCarousel";
import { useView } from "../view/ViewContext";
import Alert from "../../components/ui/Alert";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

const hideAlertOnLoad = localStorage.getItem("hideAlertShip24") === "true";

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { userTeams } = useView();
  const { matchupPlayers, isLoading, initialized, error } =
    useMatchupPlayers(selectedWeek);
  const [hideAlert, setHideAlert] = useState(hideAlertOnLoad);

  console.log("hideAlertOnLoad", hideAlertOnLoad);
  console.log("hideAlert", hideAlert);

  if (isAuthLoading) return <LoadingSpinner />;

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  if (!matchupPlayers && initialized) {
    return <div>No games scheduled for this week.</div>;
  }

  if (!userTeams || !user) {
    console.log("redirected");
    console.log("user", user);
    console.log("matchupPlayers", matchupPlayers);
    return <Navigate to="/connect-team" />;
  }

  return (
    <div className={`${styles["matchup-guide"]} page-container`}>
      {matchupPlayers && (
        <div className={styles.header}>
          <MatchupCarousel
            games={Object.values(matchupPlayers.games)
              .flat()
              .flatMap((bucket) => bucket.games)}
          />
        </div>
      )}

      {!hideAlert && (
        <Alert
          message="&#127941; Good luck in your championships! &#127941;"
          buttonText="Hide"
          variant="outlined"
          onButtonClick={() => {
            setHideAlert(true);
            localStorage.setItem("hideAlertShip24", "true");
          }}
        />
      )}

      {matchupPlayers && (
        <div className={`${styles.gameBucketGroups} ${styles.scrollbar}`}>
          {matchupPlayers.games.inProgress.length > 0 && (
            <GameBucketGroup
              key={"inProgress"}
              status={"inProgress"}
              gameBuckets={matchupPlayers.games.inProgress}
            />
          )}
          {matchupPlayers.games.upcoming.length > 0 && (
            <GameBucketGroup
              key={"upcoming"}
              status={"upcoming"}
              gameBuckets={matchupPlayers.games.upcoming}
            />
          )}
          {matchupPlayers.games.completed.length > 0 && (
            <GameBucketGroup
              key={"completed"}
              status={"completed"}
              gameBuckets={matchupPlayers.games.completed}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MatchupGuide;
