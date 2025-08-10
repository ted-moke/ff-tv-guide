import React, { useMemo, useState } from "react";
import styles from "./PlayerShares.module.css";
import { getTeamsByConference, NFL_TEAMS } from "../features/nfl/nflTeams";
import { Player } from "../features/nfl/nflTypes";
import { usePlayers, getPlayersByTeam } from "../features/players/usePlayers";
import { useView } from "../features/view/ViewContext";
import { useAuthContext } from "../features/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PlayerSharesFilters from "../components/PlayerSharesFilters";
import PlayerSharesGrid from "../components/PlayerSharesGrid";
import { useNeedsResources } from "../features/teams/useNeedsResources";
import Collapsible from "../components/ui/Collapsible";
import { LuFilter } from "react-icons/lu";
import { getTeamCodeByName } from "../features/teams/getTeamCodeByName";

interface GroupedPlayer {
  team: string;
  players: Player[];
  division: string;
  conference: string;
}

const PlayerShares: React.FC = () => {
  const {
    activeConference,
    playerSharesSortBy,
    playerSharesHideEmptyTeams,
    selectedTeams,
    userTeams,
    selectedPositions,
    playerSharesSearchTerm,
  } = useView();
  const { players, isLoading, error } = usePlayers({ includeOpponents: false });
  const { isLoading: isAuthLoading } = useAuthContext();
  const {
    isLoading: needsConnectLoading,
    needsConnect,
    needsAccount,
  } = useNeedsResources();

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

    const filteredPlayers = playerSharesHideEmptyTeams
      ? groupedPlayers.filter((team) => team.players.length > 0)
      : groupedPlayers;

    return filteredPlayers.sort((a, b) => {
      if (playerSharesSortBy === "division") {
        return (
          a.division.localeCompare(b.division) || a.team.localeCompare(b.team)
        );
      } else if (playerSharesSortBy === "players") {
        return (
          b.players.length - a.players.length || a.team.localeCompare(b.team)
        );
      } else if (playerSharesSortBy === "shares") {
        const aShares = a.players.reduce(
          (count, player) => count + player.copies.length,
          0
        );
        const bShares = b.players.reduce(
          (count, player) => count + player.copies.length,
          0
        );
        return bShares - aShares || a.team.localeCompare(b.team);
      } else {
        return a.team.localeCompare(b.team);
      }
    });
  }, [
    activeConference,
    playerSharesSortBy,
    playerSharesHideEmptyTeams,
    allPlayers,
  ]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalPlayers = sortedGroupedPlayers.reduce(
      (sum, team) => sum + team.players.length,
      0
    );
    const totalShares = sortedGroupedPlayers.reduce(
      (sum, team) =>
        sum +
        team.players.reduce(
          (teamSum, player) => teamSum + player.copies.length,
          0
        ),
      0
    );
    const teamsWithPlayers = sortedGroupedPlayers.filter(
      (team) => team.players.length > 0
    ).length;

    const sharesByTeam = sortedGroupedPlayers.reduce((acc, team) => {
      acc[team.team] = team.players.reduce((sum, player) => sum + player.copies.length, 0);
      return acc;
    }, {} as Record<string, number>);

    const mostOwnedTeam = Object.entries(sharesByTeam).reduce((max, [team, shares]) => {
      return shares > max.shares ? { team, shares } : max;
    }, { team: "", shares: 0 });

    const leastOwnedTeam = Object.entries(sharesByTeam).reduce((min, [team, shares]) => {
      return shares < min.shares ? { team, shares } : min;
    }, { team: "", shares: Infinity });

    return { totalPlayers, totalShares, teamsWithPlayers, sharesByTeam, mostOwnedTeam, leastOwnedTeam };
  }, [sortedGroupedPlayers]);

  if (isAuthLoading || needsConnectLoading) return <LoadingSpinner />;
  if (needsAccount) {
    return <Navigate to="/splash" />;
  }

  if (needsConnect) {
    return <Navigate to="/connect-team" />;
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error("Error in PlayerShares:", error);
    return (
      <div className={`${styles.playerShares} page-container`}>
        <h1>Player Shares</h1>
        <div className={styles.errorContainer}>
          <p>Error loading players: {(error as Error).message}</p>
          <p>Please try refreshing the page or check your connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.playerShares} page-container`}>
      <h1>Player Shares</h1>

      <div className={styles.userTeamFilterWrapper}>
        <p>Showing {userTeams.length} teams</p>
      </div>

      <div className={styles.summaryStats}>
        
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Most Owned Team:</label>
          <div className={styles.statValueContainer}>
            <p className={styles.statValue}>{getTeamCodeByName(summaryStats.mostOwnedTeam.team)}</p>
            <p className={styles.statValueSub}>{summaryStats.mostOwnedTeam.shares} shares</p>
            <p className={styles.statValueSub}>{((summaryStats.mostOwnedTeam.shares / summaryStats.totalShares) * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Least Owned Team:</label>
          <div className={styles.statValueContainer}>
            <p className={styles.statValue}>{getTeamCodeByName(summaryStats.leastOwnedTeam.team)}</p>
            <p className={styles.statValueSub}>{summaryStats.leastOwnedTeam.shares} shares</p>
            <p className={styles.statValueSub}>{((summaryStats.leastOwnedTeam.shares / summaryStats.totalShares) * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>NFL Teams:</label>
          <div className={styles.statValueContainer}>
            <p className={styles.statValue}>
              {summaryStats.teamsWithPlayers}
            </p>
          </div>
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Players:</label>
          <div className={styles.statValueContainer}>
            <p className={styles.statValue}>
              {summaryStats.totalPlayers}
            </p>
          </div>
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Total Shares:</label>
          <div className={styles.statValueContainer}>
            <p className={styles.statValue}>
              {summaryStats.totalShares}
            </p>
          </div>
        </div>
      </div>

      <Collapsible
        title="Filters"
        defaultCollapsed={true}
        onClear={() => {}}
        showClear={false}
        clearLabel="Clear"
        className={styles.filtersCollapsible}
        icon={<LuFilter />}
      >
        <PlayerSharesFilters />
      </Collapsible>

      <p className={styles.sortBy}>
        Sorted by{" "}
        {playerSharesSortBy === "players"
          ? "Player Count"
          : playerSharesSortBy === "shares"
          ? "Shares"
          : playerSharesSortBy}
      </p>

      <PlayerSharesGrid
        groupedPlayers={sortedGroupedPlayers}
        selectedTeams={selectedTeams}
        selectedPositions={selectedPositions}
        searchTerm={playerSharesSearchTerm}
      />
    </div>
  );
};

export default PlayerShares;
