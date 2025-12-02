import styles from "./MatchupGuide.module.css";
import GameBucketGroup from "./GameBucketGroup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider2";
import { useNeedsResources } from "../teams/useNeedsResources";
import { useView } from "../view/ViewContext";
import { LeagueCardsSection } from "../league/LeagueCards/LeagueCardsSection";
import { useLeagueTickerVisibility } from "../league/useLeagueTickerVisibility";

// const hideAlertOnLoad = localStorage.getItem("hideAlertShip24") === "true";

const MatchupGuide = () => {
  const {
    isMobile,
    matchupPlayers,
    matchupPlayersLoading,
    matchupPlayersInitialized,
    matchupPlayersError,
  } = useView();
  const isTickerVisible = useLeagueTickerVisibility();
  const { isLoading: isAuthLoading } = useAuthContext();
  const {
    isLoading: needsConnectLoading,
    needsConnect,
    needsAccount,
  } = useNeedsResources();
  // const [hideAlert, setHideAlert] = useState(hideAlertOnLoad);

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
      {!isMobile && isTickerVisible && (
        <div className={`${styles.leagueTickerWrapper} ${styles.fixed}`}>
          {/* <LeagueTicker /> */}
        </div>
      )}
      {/* <WeekRemainingSection /> */}
      <LeagueCardsSection />
      {matchupPlayers && (
        <div className={styles.gameBucketGroups}>
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
