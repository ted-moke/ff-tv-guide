import styles from "./MatchupGuide.module.css";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider2";
import { useNeedsResources } from "../teams/useNeedsResources";
import { useView } from "../view/ViewContext";
import { LeagueCardsSection } from "../league/LeagueCards/LeagueCardsSection";
import Alert from "../../components/ui/Alert";
import { useState } from "react";
import { PreferencesSection } from "../preferences/PreferencesSection";

const hideAlertOnLoad = localStorage.getItem("hideAlertShip25") === "true";

const MatchupGuide = () => {
  const {
    matchupPlayers,
    matchupPlayersLoading,
    matchupPlayersInitialized,
    matchupPlayersError,
    isPreferencesOpen,
    setIsPreferencesOpen,
  } = useView();
  const { isLoading: isAuthLoading } = useAuthContext();
  const {
    isLoading: needsConnectLoading,
    needsConnect,
    needsAccount,
  } = useNeedsResources();
  const [hideAlert, setHideAlert] = useState(hideAlertOnLoad);

  if (matchupPlayersLoading) {
    return <LoadingSpinner text="Calculating matchups..." />;
  }

  if (needsConnectLoading || isAuthLoading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (matchupPlayersError) {
    console.error("Error in MatchupGuide:", matchupPlayersError);
    return (
      <div>
        Error loading user teams: {(matchupPlayersError as Error).message}
      </div>
    );
  }

  if (!matchupPlayers && matchupPlayersInitialized) {
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
      {!hideAlert && (
        <div className={styles.alertContainer}>
          <Alert
            message="&#127941; Good luck in your playoffs! &#127941;"
            buttonText="Edit Visible Leagues"
            variant="outlined"
            onButtonClick={() => {
              setIsPreferencesOpen(true);
              setHideAlert(true);
              localStorage.setItem("hideAlertShip25", "true");
            }}
          />
        </div>
      )}
      {isPreferencesOpen && <PreferencesSection />}
      <LeagueCardsSection />
      {matchupPlayers && (
        <div className={styles.gameBucketGroups}>
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
