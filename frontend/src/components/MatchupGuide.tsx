import React from "react";
import styles from "./MatchupGuide.module.css";
import { formatDateToEastern } from "../utils/dateUtils";
import { usePlayers } from "../features/players/usePlayers";
import Alert from "./Alert";
import PlayerList from "./PlayerList";
import { useWeeklySchedule } from "../hooks/useWeeklySchedule";
import { useProcessedSchedule } from "../hooks/useProcessedSchedule";

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { players, isLoading, error } = usePlayers();
  const weeklySchedule = useWeeklySchedule(selectedWeek);
  const processedSchedule = useProcessedSchedule(weeklySchedule, players);

  if (isLoading) return <div>Loading user teams...</div>;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  return (
    <div className={styles["matchup-guide"]}>
      <h2>Week {selectedWeek} Matchups</h2>
      {players && players.starters.length === 0 && players.others.length === 0 && (
        <Alert
          message="No fantasy teams connected."
          buttonText="Connect a Team"
          onButtonClick={() => (window.location.href = "/connect-team")}
        />
      )}
      {processedSchedule.length > 0 ? (
        processedSchedule.map(([startTime, games], index) => (
          <div key={index} className={styles["game-group"]}>
            <h3>
              {formatDateToEastern(
                startTime.split(" ")[0],
                startTime.split(" ")[1]
              )}
            </h3>
            <div className={styles["game-group-content"]}>
              {games.map((game, gameIndex) => (
                <div key={gameIndex} className={styles.matchup}>
                  <div className={styles["matchup-header"]}>
                    <div className={styles["team-names"]}>
                      <span className={styles["away-team"]}>
                        {game.awayTeam?.code}
                      </span>
                      <span className={styles["at-symbol"]}>@</span>
                      <span className={styles["home-team"]}>
                        {game.homeTeam?.code}
                      </span>
                    </div>
                    <div className={styles["matchup-subheader"]}>
                      <div className={styles["player-count"]}>
                        {game.hasPlayers
                          ? `${game.starterCount} Starter${
                              game.starterCount !== 1 ? "s" : ""
                            } (${game.totalPlayers} total)`
                          : "No Players"}
                      </div>
                      <div className={styles.channel}>{game.channel}</div>
                    </div>
                  </div>
                  <div className={styles["matchup-content"]}>
                    {game.hasPlayers ? (
                      <div className={styles["team-players"]}>
                        {game.awayPlayers.starters.length > 0 ||
                        game.homePlayers.starters.length > 0 ? (
                          <>
                            <h4>My Starters</h4>
                            <div className={styles["starters"]}>
                              <div className={styles["players-wrapper"]}>
                                <PlayerList players={game.awayPlayers.starters} />
                              </div>
                              <div className={styles["players-wrapper"]}>
                                <PlayerList players={game.homePlayers.starters} />
                              </div>
                            </div>
                          </>
                        ) : null}
                        {game.awayPlayers.others.length > 0 ||
                        game.homePlayers.others.length > 0 ? (
                          <>
                            <hr className={styles["player-divider"]} />
                            <h4>My Bench</h4>
                            <div className={styles["bench"]}>
                              <PlayerList players={game.awayPlayers.others} />
                              <PlayerList players={game.homePlayers.others} />
                            </div>
                          </>
                        ) : null}
                      </div>
                    ) : (
                      <p className={styles["no-players"]}>
                        No fantasy players
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No games scheduled for this week.</p>
      )}
    </div>
  );
};

export default MatchupGuide;
