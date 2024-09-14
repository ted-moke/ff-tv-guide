import React from "react";
import styles from "./MatchupGuide.module.css";
import Alert from "../../components/ui/Alert";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameMatchup from "./GameMatchup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { matchupPlayers, isLoading, error } = useMatchupPlayers(selectedWeek);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  if (!matchupPlayers) {
    return <div>No games scheduled for this week.</div>;
  }

  return (
    <div className={styles["matchup-guide"]}>
      <h2>Week {matchupPlayers.weekNumber} Matchups</h2>
      {matchupPlayers.games.upcoming.length === 0 &&
       matchupPlayers.games.inProgress.length === 0 &&
       matchupPlayers.games.completed.length === 0 && (
        <Alert
          message="No fantasy teams connected."
          buttonText="Connect a Team"
          onButtonClick={() => (window.location.href = "/connect-team")}
        />
      )}
      {Object.entries(matchupPlayers.games).map(([status, games]) => (
        <div key={status} className={styles["game-group"]}>
          <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Games</h3>
          <div className={styles["game-group-content"]}>
            {games.map((game, gameIndex) => (
              <GameMatchup 
                key={`${status}-${gameIndex}`}
                game={game}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchupGuide;
