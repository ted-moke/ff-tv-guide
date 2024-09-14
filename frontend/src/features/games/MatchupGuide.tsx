import React from "react";
import styles from "./MatchupGuide.module.css";
import { formatDateToEastern } from "../../utils/dateUtils";
import Alert from "../../components/ui/Alert";
import Player from "../players/Player";
import PlayerCondensed from "../players/PlayerCondensed";
import { useMatchupPlayers } from "../players/useMatchupPlayers";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { matchupPlayers, isLoading, error } = useMatchupPlayers(selectedWeek);

  if (isLoading) return <div>Loading user teams...</div>;
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
              <div key={gameIndex} className={styles.matchup}>
                <div className={styles["matchup-header"]}>
                  <div className={styles["team-names"]}>
                    <span className={styles["away-team"]}>{game.awayTeam?.code}</span>
                    <span className={styles["at-symbol"]}>@</span>
                    <span className={styles["home-team"]}>{game.homeTeam?.code}</span>
                  </div>
                  <div className={styles["matchup-subheader"]}>
                    <div className={styles["player-count"]}>
                      {game.hasPlayers
                        ? `${game.totals.self.starters + game.totals.opponent.starters} Starter${
                            game.totals.self.starters + game.totals.opponent.starters !== 1 ? "s" : ""
                          } (${game.totals.self.total + game.totals.opponent.total} total)`
                        : "No Players"}
                    </div>
                    <div className={styles.channel}>{game.channel}</div>
                  </div>
                </div>
                {game.hasPlayers ? (
                  <div className={styles["team-players"]}>
                    {game.starters.length > 0 && (
                      <div className={styles["starters"]}>
                        <div className={styles["players-wrapper"]}>
                          {game.starters.map((player) => (
                            <PlayerCondensed
                              key={`${player.name}-${player.team}`}
                              player={player}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {game.others.length > 0 && (
                      <>
                        <hr className={styles["player-divider"]} />
                        <h4>My Bench</h4>
                        <div className={styles["bench"]}>
                          {game.others.map((player) => (
                            <PlayerCondensed
                              key={`${player.name}-${player.team}`}
                              player={player}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className={styles["no-players"]}>No fantasy players</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchupGuide;
