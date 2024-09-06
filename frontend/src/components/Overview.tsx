import React, { useMemo } from 'react';
import styles from './Overview.module.css';
import { PLAYERS } from '../features/nfl/nflData';
import { getTeamsByConference } from '../features/nfl/nflTeams';
import { Player } from '../features/nfl/nflTypes';

interface OverviewProps {
  activeFantasyTeams: string[];
  activeConference: 'AFC' | 'NFC' | 'Both';
  sortBy: 'division' | 'players' | 'name';
  hideEmptyTeams: boolean;
}

interface GroupedPlayer {
  team: string;
  players: Player[];
  division: string;
}

const Overview: React.FC<OverviewProps> = ({ activeFantasyTeams, activeConference, sortBy, hideEmptyTeams }) => {
  const sortedGroupedPlayers = useMemo<GroupedPlayer[]>(() => {
    const groupedPlayers: GroupedPlayer[] = getTeamsByConference(activeConference).map(team => {
      return {
        team: team.name,
        players: PLAYERS.filter(player => player.team === team.code && activeFantasyTeams.includes(player.userTeams[0])),
        division: team.division
      };
    });

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
                <li key={player.name} title={player.userTeams.join(', ')}>
                  {player.name}
                  {player.userTeams.length > 1 && <span className={styles['multi-team']}> x{player.userTeams.length}</span>}
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