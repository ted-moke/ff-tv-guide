import React, { useMemo } from "react";
import styles from "./MatchupGuide.module.css";
import { NFLGame, Player } from "../features/nfl/nflTypes";
import { formatDateToEastern } from "../utils/dateUtils";
import { groupGamesByStartTime } from "../features/nfl/nflUtils";
import nflSchedule from "../assets/nfl-schedule-2024.json";
import { usePlayers, getPlayersByTeam } from "../features/players/usePlayers";
import { getTeamByName } from "../features/nfl/nflTeams";
import Alert from "./Alert"; // Import the new Alert component

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

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek }) => {
  const { players, isLoading, error } = usePlayers();
  let starters: Player[] = [];
  let others: Player[] = [];

  if (players) {
    starters = players.starters;
    others = players.others;
  }

  const weeklySchedule = useMemo(() => {
    const schedule = nflSchedule as NFLSchedule;
    const selectedWeekSchedule = schedule.weeks.find(
      (week) => week.weekNumber === selectedWeek
    );
    return selectedWeekSchedule
      ? groupGamesByStartTime(selectedWeekSchedule.games)
      : [];
  }, [selectedWeek]);

  if (isLoading) return <div>Loading user teams...</div>;
  if (error) {
    console.error("Error in MatchupGuide:", error);
    return <div>Error loading user teams: {(error as Error).message}</div>;
  }

  return (
    <div className={styles["matchup-guide"]}>
      <h2>Week {selectedWeek} Matchups</h2>
      {starters.length === 0 && others.length === 0 && (
        <Alert
          message="No fantasy teams connected."
          buttonText="Connect a Team"
          onButtonClick={() => (window.location.href = "/connect-team")}
        />
      )}
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

                const awayPlayers = awayTeam
                  ? getPlayersByTeam(awayTeam.code, [...starters, ...others])
                  : { starters: [], others: [] };
                const homePlayers = homeTeam
                  ? getPlayersByTeam(homeTeam.code, [...starters, ...others])
                  : { starters: [], others: [] };

                const starterCount =
                  awayPlayers.starters.length + homePlayers.starters.length;
                const totalPlayers = [
                  ...awayPlayers.starters,
                  ...awayPlayers.others,
                  ...homePlayers.starters,
                  ...homePlayers.others,
                ].reduce((sum, player) => sum + player.userTeams.length, 0);

                const hasPlayers = totalPlayers > 0;

                const renderPlayerList = (playersToRender: Player[]) =>
                  playersToRender.map((player) => (
                    <div
                      key={player.name}
                      className={styles.player}
                      title={`${player.userTeams.join("\n")}`}
                    >
                      <p className={styles["player-team"]}>{player.team}</p>
                      <p
                        className={`${styles["player-position"]} ${
                          styles[player.position]
                        }`}
                      >
                        {player.position}
                      </p>
                      <p className={styles["player-name"]}>{player.name}</p>
                      <span className={styles["player-position"]}>
                        {" "}
                        {player.userTeams.length > 1
                          ? ` x${player.userTeams.length}`
                          : ""}
                      </span>
                      <div className={styles["player-user-teams"]}>
                        {player.userTeams.map((userTeam) => (
                          <p>{userTeam}</p>
                        ))}
                      </div>
                    </div>
                  ));

                return (
                  <div key={gameIndex} className={styles.matchup}>
                    <div className={styles["matchup-header"]}>
                      <div className={styles["team-names"]}>
                        <span className={styles["away-team"]}>
                          {awayTeam?.code}
                        </span>
                        <span className={styles["at-symbol"]}>@</span>
                        <span className={styles["home-team"]}>
                          {homeTeam?.code}
                        </span>
                      </div>
                      <div className={styles["matchup-subheader"]}>
                        <div className={styles["player-count"]}>
                          {hasPlayers
                            ? `${starterCount} Starter${
                                starterCount !== 1 ? "s" : ""
                              } (${totalPlayers} total)`
                            : "No Players"}
                        </div>
                        <div className={styles.channel}>{game.channel}</div>
                      </div>
                    </div>
                    <div className={styles["matchup-content"]}>
                      {hasPlayers ? (
                        <div className={styles["team-players"]}>
                          {awayPlayers.starters.length > 0 ||
                          homePlayers.starters.length > 0 ? (
                            <>
                              <h4>My Starters</h4>
                              <div className={styles["starters"]}>
                                <div className={styles["players-wrapper"]}>
                                  {renderPlayerList(awayPlayers.starters)}
                                </div>
                                <div className={styles["players-wrapper"]}>
                                  {renderPlayerList(homePlayers.starters)}
                                </div>
                              </div>
                            </>
                          ) : null}
                          {awayPlayers.others.length > 0 ||
                          homePlayers.others.length > 0 ? (
                            <>
                              <hr className={styles["player-divider"]} />
                              <h4>My Bench</h4>
                              <div className={styles["bench"]}>
                                {renderPlayerList(awayPlayers.others)}
                                {renderPlayerList(homePlayers.others)}
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
