import React, { useMemo } from "react";
import styles from "./MatchupGuide.module.css";
import { NFLGame, NFLTeam } from "../features/nfl/nflTypes";
import { formatDateToEastern } from "../utils/dateUtils";
import { groupGamesByStartTime } from "../features/nfl/nflUtils";
import nflSchedule from "../assets/nfl-schedule-2024.json";
import useUserTeams from "../features/teams/useUserTeams";
import { getTeamByName } from '../features/nfl/nflTeams';

interface MatchupGuideProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  activeFantasyTeams: string[];
}

interface NflWeekSchedule {
  weekNumber: number;
  games: NFLGame[];
}

interface NFLSchedule {
  season: number;
  weeks: NflWeekSchedule[];
}

const MatchupGuide: React.FC<MatchupGuideProps> = ({
  selectedWeek,
}) => {
  const { data: userTeams, isLoading, error } = useUserTeams();

  const weeklySchedule = useMemo(() => {
    const schedule = nflSchedule as NFLSchedule;
    const selectedWeekSchedule = schedule.weeks.find(
      (week) => week.weekNumber === selectedWeek
    );
    return selectedWeekSchedule
      ? groupGamesByStartTime(selectedWeekSchedule.games)
      : [];
  }, [selectedWeek]);

  const getFantasyPlayersForTeam = (nflTeam: NFLTeam) => {
    if (!userTeams || !nflTeam) return [];

    return Object.values(userTeams)
      .flatMap((team) =>
        team.playerData.filter((player) => player.team === nflTeam.code)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  if (isLoading) return <div>Loading user teams...</div>;
  if (error) {
    console.error('Error in MatchupGuide:', error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  return (
    <div className={styles["matchup-guide"]}>
      <h2>Week {selectedWeek} Matchups</h2>
      {weeklySchedule.length > 0 ? (
        weeklySchedule.map(([startTime, games], index) => (
          <div key={index} className={styles["game-group"]}>
            <h3>
              {formatDateToEastern(
                startTime.split(" ")[0],
                startTime.split(" ")[1]
              )}
            </h3>
            <div className={styles["game-group-content"]}>
              {games.map((game: NFLGame, gameIndex) => {
                const awayTeam = getTeamByName(game.awayTeam);
                const homeTeam = getTeamByName(game.homeTeam);

                const awayPlayers = (awayTeam && getFantasyPlayersForTeam(awayTeam)) ?? [];
                const homePlayers = (homeTeam && getFantasyPlayersForTeam(homeTeam)) ?? [];
                const hasPlayers =
                  awayPlayers.length > 0 || homePlayers.length > 0;
                return (
                  <div key={gameIndex} className={styles.matchup}>
                    <div className={styles["matchup-header"]}>
                      <div className={styles["team-names"]}>
                        <span className={styles["away-team"]}>
                          {game.awayTeam}
                        </span>
                        <span className={styles["at-symbol"]}>@</span>
                        <span className={styles["home-team"]}>
                          {game.homeTeam}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${styles["matchup-content"]} ${
                        !hasPlayers ? styles["no-players-content"] : ""
                      }`}
                    >
                      {hasPlayers ? (
                        <div className={styles["team-players"]}>
                          <div className={styles["away-team"]}>
                            {awayPlayers.length > 0 ? (
                              awayPlayers.map((player) => (
                                <p
                                  key={player.name}
                                  className={styles.player}
                                  title={player.position} // Changed from activeFantasyTeams to position
                                >
                                  {player.name}
                                  <span className={styles["player-position"]}>
                                    {" "}
                                    ({player.position})
                                  </span>
                                </p>
                              ))
                            ) : (
                              <p className={styles["no-players"]}>
                                No fantasy players
                              </p>
                            )}
                          </div>
                          <div className={styles["home-team"]}>
                            {homePlayers.length > 0 ? (
                              homePlayers.map((player) => (
                                <p
                                  key={player.name}
                                  className={styles.player}
                                  title={player.position} // Changed from activeFantasyTeams to position
                                >
                                  {player.name}
                                  <span className={styles["player-position"]}>
                                    {" "}
                                    ({player.position})
                                  </span>
                                </p>
                              ))
                            ) : (
                              <p className={styles["no-players"]}>
                                No fantasy players
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className={styles["no-players"]}>
                          No fantasy players
                        </p>
                      )}
                    </div>
                    <div className={styles["matchup-footer"]}>
                      <span className={styles.channel}>{game.channel}</span>
                    </div>
                  </div>
                );
              })}
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
