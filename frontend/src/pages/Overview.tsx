import React, { useMemo } from "react";
import styles from "./Overview.module.css";
import { getTeamsByConference, NFL_TEAMS } from "../features/nfl/nflTeams";
import { Player } from "../features/nfl/nflTypes";
import { usePlayers, getPlayersByTeam } from "../features/players/usePlayers";
import { useView } from "../features/view/ViewContext";
import { useAuthContext } from "../features/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PlayerCondensed from "../features/players/PlayerCondensed";

interface GroupedPlayer {
  team: string;
  players: Player[];
  division: string;
  conference: string;
}

const Overview: React.FC = () => {
  const { activeConference, sortBy, hideEmptyTeams } =
    useView();
  const { players, isLoading, error } = usePlayers({ includeOpponents: false });
  const { user, isLoading: isAuthLoading } = useAuthContext();

  let allPlayers: Player[] = players ?? [];

  const sortedGroupedPlayers = useMemo<GroupedPlayer[]>(() => {
    const teams =
      activeConference === "Both"
        ? Object.values(NFL_TEAMS)
        : getTeamsByConference(activeConference);

    const groupedPlayers: GroupedPlayer[] = teams.map((team) => {
      const teamPlayers = getPlayersByTeam(team.codes, allPlayers);
      return {
        team: team.name,
        players: teamPlayers.allSelf,
        division: team.division,
        conference: team.conference,
      };
    });

    const filteredPlayers = hideEmptyTeams
      ? groupedPlayers.filter((team) => team.players.length > 0)
      : groupedPlayers;

    return filteredPlayers.sort((a, b) => {
      if (sortBy === "division") {
        return (
          a.division.localeCompare(b.division) || a.team.localeCompare(b.team)
        );
      } else if (sortBy === "players") {
        return (
          b.players.length - a.players.length || a.team.localeCompare(b.team)
        );
      } else {
        return a.team.localeCompare(b.team);
      }
    });
  }, [
    activeConference,
    sortBy,
    hideEmptyTeams,
    allPlayers,
  ]);

  if (isAuthLoading) return <LoadingSpinner />;
  if (!user) {
    console.log("user", user);
    return <Navigate to="/connect-team" />;
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Error in Overview:", error);
    return <div>Error loading players: {(error as Error).message}</div>;
  }

  return (
    <div className={`${styles.overview} page-container`}>
      <h1>NFL Teams Overview</h1>
      <p className={styles.sortBy}>
        Sorted by {sortBy === "players" ? "Player Count" : "division"}
      </p>
      <div className={styles.teamsGrid}>
        {sortedGroupedPlayers.map(({ team, players, conference, division }) => {
          const playerCount = players.reduce(
            (count, player) => count + player.copies.length,
            0
          );
          return (
            <div key={team} className={styles.teamCard}>
              <div className={styles.headerWrapper}>
                <div className={styles.teamHeader}>
                  <h3>{team}</h3>
                  <div className={styles.teamInfo}>
                    <p className={styles.division}>
                      {conference} {division}
                    </p>
                  </div>
                </div>
                <div className={styles.subheader}>
                  <p className={styles.playerCount}>
                    {players.length} players{" "}
                    {playerCount !== players.length &&
                      `(${playerCount} shares)`}
                  </p>
                </div>
              </div>
              {players.length > 0 ? (
                <div className={styles.playersList}>
                  <div className={styles.playersHeader}>
                    <h6>Pos</h6>
                    <h6>Name</h6>
                    <h6>Own</h6>
                    <h6> </h6>
                  </div>
                  {players.map((player) => (
                    <PlayerCondensed
                      key={`${player.name}-${player.team}`}
                      player={player}
                      slotType="both"
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.noPlayers}>
                  No fantasy players in this team
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
