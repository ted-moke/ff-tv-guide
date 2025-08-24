import React from "react";
import styles from "./MatchupGuide.module.css";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider2";
import MatchupCarousel from "./MatchupCarousel";
import { useNeedsResources } from "../teams/useNeedsResources";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

// const hideAlertOnLoad = localStorage.getItem("hideAlertShip24") === "true";

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { isLoading: isAuthLoading } = useAuthContext();
  const { isLoading: needsConnectLoading, needsConnect, needsAccount } = useNeedsResources();
  const { matchupPlayers, isLoading, initialized, error } =
    useMatchupPlayers(selectedWeek);
  // const [hideAlert, setHideAlert] = useState(hideAlertOnLoad);

  if (isLoading || needsConnectLoading || isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  if (!matchupPlayers && initialized) {
    return <div>No games scheduled for this week.</div>;
  }

  if (needsAccount) {
    console.warn("needsAccount", needsAccount);
    return <Navigate to="/connect-team" />;
  }

  if (needsConnect) {
    console.warn("needsConnect", needsConnect);
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

      {matchupPlayers && (
        <div className={`${styles.gameBucketGroups} ${styles.scrollbar}`}>
          {/* {!hideAlert && (
            <div className={styles.alertContainer}>
              <Alert
                message="&#127941; Good luck in your championships! &#127941;"
                buttonText="Hide"
                variant="outlined"
                onButtonClick={() => {
                  setHideAlert(true);
                  localStorage.setItem("hideAlertShip24", "true");
                }}
              />
            </div>
          )} */}
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
