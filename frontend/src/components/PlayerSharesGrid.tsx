import React from "react";
import styles from "./PlayerSharesGrid.module.css";
import { Player } from "../features/nfl/nflTypes";
import PlayerSharesCard from "./PlayerSharesCard";

interface GroupedPlayer {
  team: string;
  players: Player[];
  division: string;
  conference: string;
}

interface PlayerSharesGridProps {
  groupedPlayers: GroupedPlayer[];
  selectedTeams: string[];
  selectedPositions: string[];
  searchTerm: string;
}

const PlayerSharesGrid: React.FC<PlayerSharesGridProps> = ({
  groupedPlayers,
  selectedTeams,
  selectedPositions,
  searchTerm,
}) => {
  const filteredGroupedPlayers = groupedPlayers
    .filter(({ team }) => 
      selectedTeams.length === 0 || selectedTeams.includes(team)
    )
    .map(({ team, players, division, conference }) => ({
      team,
      players: players.filter(player => 
        (selectedPositions.length === 0 || selectedPositions.includes(player.position)) &&
        (searchTerm === "" || 
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.position.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
      division,
      conference,
    }))
    .filter(({ players }) => players.length > 0);

  if (filteredGroupedPlayers.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No players match the current filters.</p>
        <p>Try adjusting your team or position filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.teamsGrid}>
      {filteredGroupedPlayers.map(({ team, players, conference, division }) => (
        <PlayerSharesCard
          key={team}
          team={team}
          players={players}
          conference={conference}
          division={division}
        />
      ))}
    </div>
  );
};

export default PlayerSharesGrid;
