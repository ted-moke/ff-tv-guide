import React from "react";
import styles from "./MatchupGuide.module.css";
import Alert from "../../components/ui/Alert";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import GameMatchup from "./GameMatchup";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const navigate = useNavigate();

  const { hasPlayers, matchupPlayers, isLoading, error } =
    useMatchupPlayers(selectedWeek);

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
      <h2>Week {matchupPlayers.weekNumber} Matchups</h2>
      {Object.entries(matchupPlayers.games).map(([status, games]) => (
        <div key={status} className={styles["game-group"]}>
          <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Games</h3>
          <div className={styles["game-group-content"]}>
            {games.map((game, gameIndex) => (
              <GameMatchup key={`${status}-${gameIndex}`} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchupGuide;
