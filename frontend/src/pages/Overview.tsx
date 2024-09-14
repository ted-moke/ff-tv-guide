// import React, { useMemo } from 'react';
// import styles from './Overview.module.css';
// import { getTeamsByConference, NFL_TEAMS } from '../features/nfl/nflTeams';
// import { Player } from '../features/nfl/nflTypes';
// import { usePlayers, getPlayersByTeam } from '../features/players/usePlayers';
import React from 'react';
// import { Player } from '../features/nfl/nflTypes';

interface OverviewProps {
  activeFantasyTeams: string[];
  activeConference: 'AFC' | 'NFC' | 'Both';
  sortBy: 'division' | 'players' | 'name';
  hideEmptyTeams: boolean;
}

// interface GroupedPlayer {
//   team: string;
//   players: Player[];
//   division: string;
// }

const Overview: React.FC<OverviewProps> = () => {
// const Overview: React.FC<OverviewProps> = ({ activeFantasyTeams, activeConference, sortBy, hideEmptyTeams }) => {
  return (
    <div>
      <h1>Overview</h1>
    </div>
  );
  // const { players, isLoading, error } = usePlayers();
  // let allPlayers: Player[] = [];

  // if (players) {
  //   allPlayers = [...players.starters, ...players.others];
  // }

  // const sortedGroupedPlayers = useMemo<GroupedPlayer[]>(() => {
  //   console.log("allPlayers", allPlayers);
  //   console.log("activeFantasyTeams", activeFantasyTeams);
  //   console.log("activeConference", activeConference);
  //   const teams = activeConference === 'Both' ? Object.values(NFL_TEAMS) : getTeamsByConference(activeConference);

  //   const groupedPlayers: GroupedPlayer[] = teams.map(team => {
  //     const teamPlayers = getPlayersByTeam(team.code, allPlayers);
  //     return {
  //       team: team.name,
  //       players: teamPlayers.starters.concat(teamPlayers.others),
  //       division: team.division
  //     };
  //   });

  //   const filteredPlayers = hideEmptyTeams ? groupedPlayers.filter(team => team.players.length > 0) : groupedPlayers;

  //   return filteredPlayers.sort((a, b) => {
  //     if (sortBy === 'division') {
  //       return a.division.localeCompare(b.division) || a.team.localeCompare(b.team);
  //     } else if (sortBy === 'players') {
  //       return b.players.length - a.players.length || a.team.localeCompare(b.team);
  //     } else {
  //       return a.team.localeCompare(b.team);
  //     }
  //   });
  // }, [activeConference, activeFantasyTeams, sortBy, hideEmptyTeams, allPlayers]);

  // if (isLoading) return <div>Loading players...</div>;
  // if (error) {
  //   console.error("Error in Overview:", error);
  //   return <div>Error loading players: {(error as Error).message}</div>;
  // }

  // return (
  //   <div className={styles['teams-grid']}>
  //     {sortedGroupedPlayers.map(({ team, players, division }) => {
  //       const playerCount = players.reduce((count, player) => count + player.userTeams.length, 0);
  //       return (
  //         <div key={team} className={styles['team-card']}>
  //           <h2>
  //             {team}
  //             <span className={styles['player-count']}>({playerCount})</span>
  //           </h2>
  //           <p className={styles.division}>{division}</p>
  //           {players.length > 0 ? (
  //             <ul>
  //               {players.map(player => (
  //                 <li key={player.name} title={player.userTeams.join(', ')}>
  //                   {player.name}
  //                   {player.userTeams.length > 1 && <span className={styles['multi-team']}> x{player.userTeams.length}</span>}
  //                 </li>
  //               ))}
  //             </ul>
  //           ) : (
  //             <p className={styles['no-players']}>No fantasy players in this team</p>
  //           )}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
};

export default Overview;