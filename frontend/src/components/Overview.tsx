import React, { useMemo } from 'react';
import styles from './Overview.module.css';
import { PLAYERS, NFL_TEAMS, getTeams } from '../pages/HomePage';

interface OverviewProps {
  activeFantasyTeams: string[];
  activeConference: 'AFC' | 'NFC' | 'Both';
  sortBy: 'division' | 'players' | 'name';
  hideEmptyTeams: boolean;
}

const Overview: React.FC<OverviewProps> = ({ activeFantasyTeams, activeConference, sortBy, hideEmptyTeams }) => {
  const sortedGroupedPlayers = useMemo(() => {
    const groupedPlayers = getTeams(activeConference).map(team => ({
      team,
      players: PLAYERS.filter(player => player.team === team && activeFantasyTeams.includes(player.fantasyTeams[0])),
      division: Object.entries(NFL_TEAMS).find(([_, teams]) => teams.includes(team))?.[0] || ''
    }));

    const filteredPlayers = hideEmptyTeams ? groupedPlayers.filter(team => team.players.length > 0) : groupedPlayers;

    return filteredPlayers.sort((a, b) => {
      if (sortBy === 'division') {
        return a.division.localeCompare(b.division) || a.team.localeCompare(b.team);
      } else if (sortBy === 'players') {
        return b.players.length - a.players.length || a.team.localeCompare(b.team);
      } else {
        return a.team.localeCompare(b.team);
      }
    });
  }, [activeConference, activeFantasyTeams, sortBy, hideEmptyTeams]);

  return (
    <div className={styles['teams-grid']}>
      {sortedGroupedPlayers.map(({ team, players, division }) => (
        <div key={team} className={styles['team-card']}>
          <h2>
            {team}
            <span className={styles['player-count']}>({players.length})</span>
          </h2>
          <p className={styles.division}>{division}</p>
          {players.length > 0 ? (
            <ul>
              {players.map(player => (
                <li key={player.name} title={player.fantasyTeams.join(', ')}>
                  {player.name}
                  {player.fantasyTeams.length > 1 && <span className={styles['multi-team']}> x{player.fantasyTeams.length}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles['no-players']}>No fantasy players in this team</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Overview;