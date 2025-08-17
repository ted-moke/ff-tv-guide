import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeaguesPaginated, syncLeague } from "./leagueAPI";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import styles from "./LeagueList.module.css";
import Dropdown from "../../components/ui/Dropdown";
import TextInput from "../../components/ui/TextInput";
import { Stack } from "../../components/ui/Stack";
import Chip from "../../components/ui/Chip";

const LeagueList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("lastModified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const [localSeason, setLocalSeason] = useState<string>("");
  const [localExternalLeagueId, setLocalExternalLeagueId] = useState<string>("");
  const [localId, setLocalId] = useState<string>("");
  const [localLeagueMasterId, setLocalLeagueMasterId] = useState<string>("");
  const [localName, setLocalName] = useState<string>("");
  // Filter states
  const [season, setSeason] = useState<string>("");
  const [externalLeagueId, setExternalLeagueId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [leagueMasterId, setLeagueMasterId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const queryClient = useQueryClient();

  // Build filters object
  const filters = {
    season: season ? parseInt(season, 10) : undefined,
    externalLeagueId: externalLeagueId || undefined,
    id: id || undefined,
    leagueMasterId: leagueMasterId || undefined,
    nameSearch: name || undefined, // Use nameSearch for contains matching
  };

  // Check if any filters are active
  const hasActiveFilters = season || externalLeagueId || id || leagueMasterId || name;

  const { data, isLoading, error } = useQuery({
    queryKey: ["leagues", page, startAfter, sortBy, sortOrder, filters],
    queryFn: () =>
      getLeaguesPaginated(page, 10, startAfter, sortBy, sortOrder, filters),
  });

  // Reset pagination when filters change
  React.useEffect(() => {
    setPage(1);
    setStartAfter(undefined);
  }, [season, externalLeagueId, id, leagueMasterId, name]);

  const syncMutation = useMutation({
    mutationFn: syncLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className={styles.leagueList}>
      {/* Filter Controls */}
      <div className={styles.filterControls}>
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <Stack direction="row">
              <span>Active filters: </span>
              {season && (
                <Chip label={`Season: ${season}`} />
            )}
            {externalLeagueId && (
              <Chip label={`External ID: ${externalLeagueId}`} />
            )}
            {id && <Chip label={`ID: ${id}`} />}
            {leagueMasterId && (
              <Chip label={`Master ID: ${leagueMasterId}`} />
            )}
            {name && (
              <Chip label={`Name: ${name}`} />
            )}
            </Stack>
          </div>
        )}
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <label htmlFor="season-filter">Season:</label>
              <TextInput
                id="season-filter"
                type="number"
                value={localSeason}
                onChange={(e) => setLocalSeason(e.target.value)}
                placeholder="e.g., 2025"
              />
          </div>
          <div className={styles.filterField}>
            <label htmlFor="name-filter">Name Search:</label>
            <TextInput
              id="name-filter"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Search league names..."
            />
          </div>
          <div className={styles.filterField}>
            <label htmlFor="external-league-id-filter">
              External League ID:
            </label>
            <TextInput
              id="external-league-id-filter"
              type="text"
              value={localExternalLeagueId}
              onChange={(e) => setLocalExternalLeagueId(e.target.value)}
              placeholder="External league ID"
            />
          </div>
          <div className={styles.filterField}>
            <label htmlFor="id-filter">League ID:</label>
            <TextInput
              id="id-filter"
              type="text"
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              placeholder="Internal league ID"
            />
          </div>
          <div className={styles.filterField}>
            <label htmlFor="league-master-id-filter">League Master ID:</label>
            <TextInput
              id="league-master-id-filter"
              type="text"
              value={localLeagueMasterId}
              onChange={(e) => setLocalLeagueMasterId(e.target.value)}
              placeholder="League master ID"
            />
          </div>
          <Button
                onClick={() => {
                  setSeason(localSeason);
                  setExternalLeagueId(localExternalLeagueId);
                  setId(localId);
                  setLeagueMasterId(localLeagueMasterId);
                  setName(localName);
                }}
                color="primary"
                outline
              >
                Apply
              </Button>
        </div>
        <div className={styles.filterActions}>
          <Button
            onClick={() => {
              setSeason("");
              setExternalLeagueId("");
              setId("");
              setLeagueMasterId("");
              setName("");
              setLocalSeason("");
              setLocalExternalLeagueId("");
              setLocalId("");
              setLocalLeagueMasterId("");
              setLocalName("");
              setPage(1);
              setStartAfter(undefined);
            }}
            color="primary"
            outline
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className={styles.sortControls}>
        <Dropdown
          id="sortBy"
          options={[
            { value: "name", label: "Name" },
            { value: "lastModified", label: "Last Modified" },
            { value: "season", label: "Season" },
          ]}
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortBy(e.target.value)
          }
        />
        <Dropdown
          id="sortOrder"
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          value={sortOrder}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortOrder(e.target.value as "asc" | "desc")
          }
        />
      </div>
      <div className={styles.leagueCards}>
        {data.leagues.map((league: any) => (
          <div key={league.id} className={styles.leagueCard}>
            <div className={styles.leagueInfo}>
              <h4>
                {league.name} - {league.season ?? "No Season"}
              </h4>
              <p>Id: {league.id ?? "-"}</p>
              <p>External ID: {league.externalLeagueId ?? "-"}</p>
              <p>Master: {league.leagueMasterId ?? "-"}</p>
              <p>
                Last modified: {new Date(league.lastModified).toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => syncMutation.mutate(league.id)}
              disabled={syncMutation.isPending}
            >
              {syncMutation.isPending ? "Syncing..." : "Sync"}
            </Button>
          </div>
        ))}
      </div>
      {data.hasNextPage && (
        <Button
          onClick={() => {
            setPage((prev) => prev + 1);
            setStartAfter(data.nextStartAfter);
          }}
          className={styles.loadMoreButton}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default LeagueList;
