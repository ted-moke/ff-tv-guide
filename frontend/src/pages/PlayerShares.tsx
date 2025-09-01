import React, { useMemo, useState } from "react";
import styles from "./PlayerShares.module.css";
import { getTeamsByConference, NFL_TEAMS } from "../features/nfl/nflTeams";
import { Player } from "../features/nfl/nflTypes";
import { usePlayers, getPlayersByTeam } from "../features/players/usePlayers";
import { useView } from "../features/view/ViewContext";
import { useAuthContext } from "../features/auth/AuthProvider2";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PlayerSharesGrid from "../components/PlayerSharesGrid";
import { useNeedsResources } from "../features/teams/useNeedsResources";
import PlayerSharesFilters from "../components/PlayerSharesFilters";
import Collapsible from "../components/ui/Collapsible";
import { LuFilter, LuSearch } from "react-icons/lu";
import DataTable from "../components/ui/DataTable";
import { getTeamCodesByName } from "../features/teams/getTeamCodeByName";
import { Stack } from "../components/ui/Stack";
import { DivisionChart } from "../features/stats/DivisionChart";
import Checkbox from "../components/ui/Checkbox";
import TextInput from "../components/ui/TextInput";
interface GroupedPlayer {
  team: string;
  players: Player[];
  division: string;
  conference: string;
}

const PlayerShares: React.FC = () => {
  const [hideBenchPlayers, setHideBenchPlayers] = useState(false);
  const [hideIDPlayers, setHideIDPlayers] = useState(false);
  // const [hideBestBallPlayers, setHideBestBallPlayers] = useState(false);
  const {
    activeConference,
    playerSharesSortBy,
    playerSharesHideEmptyTeams,
    selectedTeams,
    selectedPositions,
    playerSharesSearchTerm,
    scrollToElement,
    setPlayerSharesSearchTerm,
  } = useView();
  const { players, isLoading, error, hasIDPlayers } = usePlayers({
    includeOpponents: false,
    hideHiddenTeams: true,
    hideBenchPlayers,
    hideIDPlayers,
    // hideBestBallPlayers,
  });
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

    const sortedPlayers = filteredPlayers.sort((a, b) => {
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

    return sortedPlayers;
  }, [
    activeConference,
    playerSharesSortBy,
    playerSharesHideEmptyTeams,
    allPlayers,
    hideBenchPlayers,
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
      acc[team.team] = team.players.reduce(
        (sum, player) => sum + player.copies.length,
        0
      );
      return acc;
    }, {} as Record<string, number>);

    // Calculate division shares from ALL teams, not just filtered ones
    const allTeams =
      activeConference === "Both"
        ? Object.values(NFL_TEAMS)
        : getTeamsByConference(activeConference);

    const sharesByDivision = allTeams.reduce((acc, team) => {
      if (!acc[team.conference]) {
        acc[team.conference] = {};
      }
      if (!acc[team.conference][team.division]) {
        acc[team.conference][team.division] = 0;
      }

      const teamPlayers = getPlayersByTeam(team.codes, allPlayers);
      const teamShares = teamPlayers.allSelf.reduce(
        (sum, player) => sum + player.copies.length,
        0
      );

      acc[team.conference][team.division] += teamShares;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const teamsByMostOwned = Object.entries(sharesByTeam).sort((a, b) => {
      if (a[1] === b[1]) {
        return b[0].localeCompare(a[0]);
      }
      return b[1] - a[1];
    });
    const teamsByLeastOwned = Object.entries(sharesByTeam).sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0].localeCompare(b[0]);
      }
      return a[1] - b[1];
    });

    // Flatten the division data to create proper division names
    const flattenedDivisions = Object.entries(sharesByDivision).flatMap(
      ([conference, divisions]) =>
        Object.entries(divisions).map(([division, shares]) => ({
          divisionName: `${conference} ${division}`,
          shares,
          conference,
          division,
        }))
    );

    const teamsByMostOwnedByDivision = flattenedDivisions
      .sort((a, b) => {
        if (a.shares === b.shares) {
          return a.divisionName.localeCompare(b.divisionName);
        }
        return b.shares - a.shares;
      })
      .map((item) => [item.divisionName, item.shares]);

    const teamsByLeastOwnedByDivision = flattenedDivisions
      .sort((a, b) => {
        if (a.shares === b.shares) {
          return a.divisionName.localeCompare(b.divisionName);
        }
        return a.shares - b.shares;
      })
      .map((item) => [item.divisionName, item.shares]);

    const mostOwnedTeam = teamsByMostOwned[0][0];
    const leastOwnedTeam = teamsByLeastOwned[0][0];

    const mostOwnedTeamByDivision = teamsByMostOwnedByDivision[0][0];
    const leastOwnedTeamByDivision = teamsByLeastOwnedByDivision[0][0];

    return {
      totalPlayers,
      totalShares,
      teamsWithPlayers,
      sharesByTeam,
      mostOwnedTeam,
      leastOwnedTeam,
      teamsByMostOwned,
      teamsByMostOwnedByDivision,
      teamsByLeastOwned,
      teamsByLeastOwnedByDivision,
      mostOwnedTeamByDivision,
      leastOwnedTeamByDivision,
    };
  }, [sortedGroupedPlayers]);

  if (isAuthLoading || needsConnectLoading) return <LoadingSpinner />;
  if (needsAccount) {
    console.warn("needsAccount", needsAccount);
    return <Navigate to="/connect-team" />;
  }

  if (needsConnect) {
    console.warn("needsConnect", needsConnect);
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
        <TextInput
          type="text"
          id="player-search"
          placeholder="Search players..."
          value={playerSharesSearchTerm}
          onChange={(e) => setPlayerSharesSearchTerm(e.target.value)}
          outline
          icon={<LuSearch />}
          iconPosition="right"
        />
      <div className={styles.filtersContainer}>
        <Checkbox
          id="hideBenchPlayers"
          label="Starters Only"
          checked={hideBenchPlayers}
          onChange={() => setHideBenchPlayers(!hideBenchPlayers)}
        />
        {/* <Checkbox
          id="hideBestBallPlayers"
          label="Hide Best Ball Players"
          checked={hideBestBallPlayers}
          onChange={() => setHideBestBallPlayers(!hideBestBallPlayers)}
        /> */}
      <Collapsible
        title="More Filters"
        defaultCollapsed={true}
        onClear={() => {}}
        showClear={false}
        clearLabel="Clear"
        className={styles.filtersCollapsible}
        icon={<LuFilter />}
      >
        <PlayerSharesFilters
          hasIDPlayers={hasIDPlayers}
          hideIDPlayers={hideIDPlayers}
          setHideIDPlayers={setHideIDPlayers}
        />
      </Collapsible>
      </div>

      {/* <label>Showing {numberOfSelectedTeams} teams</label> */}


      {(!playerSharesSearchTerm || playerSharesSearchTerm.length === 0) && (
        <>
          <Stack direction="row" gap={1}>
            <div className={styles.statItemRow}>
              <label className={styles.statLabel}>NFL Teams:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>
                  {summaryStats.teamsWithPlayers}
                </p>
              </div>
            </div>
            <div className={styles.statItemRow}>
              <label className={styles.statLabel}>Players:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>{summaryStats.totalPlayers}</p>
              </div>
            </div>
            <div className={styles.statItemRow}>
              <label className={styles.statLabel}>Total Shares:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>{summaryStats.totalShares}</p>
              </div>
            </div>
          </Stack>

          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <label className={styles.statLabel}>Most Owned Team:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>
                  {getTeamCodesByName(summaryStats.mostOwnedTeam)?.[0] ?? "??"}
                </p>
                <p className={styles.statValueSub}>
                  {summaryStats.sharesByTeam[summaryStats.mostOwnedTeam]} shares
                </p>
                <p className={styles.statValueSub}>
                  {(
                    (summaryStats.sharesByTeam[summaryStats.mostOwnedTeam] /
                      summaryStats.totalShares) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
            <div className={styles.statItem}>
              <label className={styles.statLabel}>Least Owned Team:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>
                  {getTeamCodesByName(summaryStats.leastOwnedTeam)?.[0] ?? "??"}
                </p>
                <p className={styles.statValueSub}>
                  {summaryStats.sharesByTeam[summaryStats.leastOwnedTeam]}{" "}
                  shares
                </p>
                <p className={styles.statValueSub}>
                  {(
                    (summaryStats.sharesByTeam[summaryStats.leastOwnedTeam] /
                      summaryStats.totalShares) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
            <div className={styles.statItem}>
              <label className={styles.statLabel}>Most Owned Division:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>
                  {summaryStats.mostOwnedTeamByDivision}
                </p>
                <p className={styles.statValueSub}>
                  {typeof summaryStats.teamsByMostOwnedByDivision[0]?.[1] ===
                  "number"
                    ? summaryStats.teamsByMostOwnedByDivision[0][1]
                    : 0}{" "}
                  shares
                </p>
                <p className={styles.statValueSub}>
                  {(
                    ((typeof summaryStats.teamsByMostOwnedByDivision[0]?.[1] ===
                    "number"
                      ? summaryStats.teamsByMostOwnedByDivision[0][1]
                      : 0) /
                      summaryStats.totalShares) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
            <div className={styles.statItem}>
              <label className={styles.statLabel}>Least Owned Division:</label>
              <div className={styles.statValueContainer}>
                <p className={styles.statValue}>
                  {summaryStats.leastOwnedTeamByDivision}
                </p>
                <p className={styles.statValueSub}>
                  {typeof summaryStats.teamsByLeastOwnedByDivision[0]?.[1] ===
                  "number"
                    ? summaryStats.teamsByLeastOwnedByDivision[0][1]
                    : 0}{" "}
                  shares
                </p>
                <p className={styles.statValueSub}>
                  {(
                    ((typeof summaryStats
                      .teamsByLeastOwnedByDivision[0]?.[1] === "number"
                      ? summaryStats.teamsByLeastOwnedByDivision[0][1]
                      : 0) /
                      summaryStats.totalShares) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>

          <DivisionChart data={summaryStats.teamsByMostOwnedByDivision} />

          <div className={styles.teamsTableWrapper}>
            <h3 className={styles.sectionTitle}>Players By Team</h3>
            <DataTable
              data={summaryStats.teamsByMostOwned.map((team) => ({
                team: team[0] ?? "??",
                shares: team[1],
                percentage: (
                  (team[1] / summaryStats.totalShares) *
                  100
                ).toFixed(1),
                rank:
                  summaryStats.teamsByMostOwned.findIndex(
                    (t) => t[0] === team[0]
                  ) + 1,
              }))}
              columns={[
                {
                  key: "rank",
                  label: "Rank",
                  align: "center",
                  width: "60px",
                  format: (value) => `#${value}`,
                },
                { key: "team", label: "Team", align: "left", width: "80px" },
                {
                  key: "shares",
                  label: "Shares",
                  align: "right",
                  width: "100px",
                  format: (value) => value.toLocaleString(),
                },
                {
                  key: "percentage",
                  label: "Share %",
                  align: "right",
                  width: "100px",
                  format: (value) => `${value}%`,
                },
              ]}
              compact={true}
              striped={true}
              collapsible={{
                topRows: 3,
                bottomRows: 3,
                defaultCollapsed: true,
              }}
              onRowClick={(row) => {
                const team = row.team;
                scrollToElement(team.toLowerCase(), true);
              }}
            />
          </div>

          <div className={styles.teamsTableWrapper}>
            <h3 className={styles.sectionTitle}>Players By Division</h3>
            <DataTable
              data={summaryStats.teamsByMostOwnedByDivision.map((division) => {
                const shares =
                  typeof division[1] === "number" ? division[1] : 0;
                return {
                  division: division[0] ?? "??",
                  shares,
                  percentage: (
                    (shares / summaryStats.totalShares) *
                    100
                  ).toFixed(1),
                  rank:
                    summaryStats.teamsByMostOwnedByDivision.findIndex(
                      (t) => t[0] === division[0]
                    ) + 1,
                };
              })}
              columns={[
                {
                  key: "division",
                  label: "Division",
                  align: "left",
                  width: "80px",
                },
                {
                  key: "shares",
                  label: "Shares",
                  align: "right",
                  width: "100px",
                  format: (value) => value.toLocaleString(),
                },
                {
                  key: "percentage",
                  label: "Share %",
                  align: "right",
                  width: "100px",
                  format: (value) => `${value}%`,
                },
              ]}
              compact={true}
              striped={true}
            />
          </div>
        </>
      )}
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
