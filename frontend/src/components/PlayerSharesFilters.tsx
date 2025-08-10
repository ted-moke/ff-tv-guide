import React from "react";
import styles from "./PlayerSharesFilters.module.css";
import { useView } from "../features/view/ViewContext";
import { NFL_TEAMS } from "../features/nfl/nflTeams";
import Chip from "./ui/Chip";
import Checkbox from "./ui/Checkbox";
import TextInput from "./ui/TextInput";
import Collapsible from "./ui/Collapsible";
import { LuSearch } from "react-icons/lu";

const POSITIONS = [
  "QB",
  "RB",
  "WR",
  "TE",
  "K",
  "DEF",
  "DB",
  "S",
  "CB",
  "DE",
  "EDR",
  "DL",
  "IL",
  "LB",
];

const PlayerSharesFilters: React.FC = () => {
  const {
    playerSharesSortBy,
    setPlayerSharesSortBy,
    playerSharesHideEmptyTeams,
    setPlayerSharesHideEmptyTeams,
    selectedTeams,
    setSelectedTeams,
    selectedPositions,
    setSelectedPositions,
    playerSharesSearchTerm,
    setPlayerSharesSearchTerm,
  } = useView();

  const handleTeamToggle = (teamName: string) => {
    const newTeams = selectedTeams.includes(teamName)
      ? selectedTeams.filter((t: string) => t !== teamName)
      : [...selectedTeams, teamName];
    setSelectedTeams(newTeams);
  };

  const handlePositionToggle = (position: string) => {
    const newPositions = selectedPositions.includes(position)
      ? selectedPositions.filter((p: string) => p !== position)
      : [...selectedPositions, position];
    setSelectedPositions(newPositions);
  };

  const clearAllFilters = () => {
    setSelectedTeams([]);
    setSelectedPositions([]);
  };

  const hasActiveFilters =
    selectedTeams.length > 0 || selectedPositions.length > 0;

  // Calculate teams display text
  const getTeamsDisplayText = () => {
    if (selectedTeams.length === 0) {
      return "All NFL Teams";
    } else if (selectedTeams.length === Object.values(NFL_TEAMS).length) {
      return "All NFL Teams";
    } else {
      return "Some NFL Teams";
    }
  };

  // Calculate positions display text
  const getPositionsDisplayText = () => {
    if (selectedPositions.length === 0) {
      return "All Positions";
    } else if (selectedPositions.length === POSITIONS.length) {
      return "All Positions";
    } else {
      // Check if it's offense only
      const offensePositions = ["QB", "RB", "WR", "TE", "K"];
      const isOffenseOnly =
        selectedPositions.length === offensePositions.length &&
        offensePositions.every((pos) => selectedPositions.includes(pos));

      if (isOffenseOnly) {
        return "Offense Only";
      } else {
        return "Some Positions";
      }
    }
  };

  // Helper functions for position selection
  const selectAllPositions = () => {
    setSelectedPositions([]);
  };

  const selectOffenseOnly = () => {
    const offensePositions = ["QB", "RB", "WR", "TE", "K"];
    setSelectedPositions(offensePositions);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterSectionStack}>
        <div className={styles.filterSection}>
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
        </div>

        <div className={styles.filterSection}>
          <p>Sort By</p>
          <div className={styles.sortOptions}>
            <Chip
              label="Shares"
              onClick={() => setPlayerSharesSortBy("shares")}
              variant={playerSharesSortBy === "shares" ? "default" : "muted"}
              size="large"
            />
            <Chip
              label="Players"
              onClick={() => setPlayerSharesSortBy("players")}
              variant={playerSharesSortBy === "players" ? "default" : "muted"}
              size="large"
            />
            <Chip
              label="Division"
              onClick={() => setPlayerSharesSortBy("division")}
              variant={playerSharesSortBy === "division" ? "default" : "muted"}
              size="large"
            />
          </div>
        </div>
      </div>

      <Collapsible
        title={getTeamsDisplayText()}
        showClear={selectedTeams.length > 0}
        onClear={() => setSelectedTeams([])}
      >
        <div className={styles.teamsGrid}>
          {Object.values(NFL_TEAMS).map((team) => (
            <Checkbox
              key={team.name}
              id={`team-${team.name}`}
              label={team.name}
              checked={
                selectedTeams.length === 0 || selectedTeams.includes(team.name)
              }
              onChange={() => handleTeamToggle(team.name)}
            />
          ))}
        </div>
      </Collapsible>

      <Collapsible
        title={getPositionsDisplayText()}
        showClear={selectedPositions.length > 0}
        onClear={() => setSelectedPositions([])}
      >
        <div className={styles.helperLinks}>
          <button className={styles.helperLink} onClick={selectAllPositions}>
            All Players
          </button>
          <button className={styles.helperLink} onClick={selectOffenseOnly}>
            Offense Only
          </button>
        </div>
        <div className={styles.positionsGrid}>
          {POSITIONS.map((position) => (
            <Checkbox
              key={position}
              id={`position-${position}`}
              label={position}
              checked={
                selectedPositions.length === 0 ||
                selectedPositions.includes(position)
              }
              onChange={() => handlePositionToggle(position)}
            />
          ))}
        </div>
      </Collapsible>

      <div className={styles.filterSection}>
        <Checkbox
          id="hide-empty-teams"
          label="Hide Empty Teams"
          checked={playerSharesHideEmptyTeams}
          onChange={() =>
            setPlayerSharesHideEmptyTeams(!playerSharesHideEmptyTeams)
          }
        />
      </div>

      {hasActiveFilters && (
        <div className={styles.filterSection}>
          <button className={styles.clearAllButton} onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerSharesFilters;
