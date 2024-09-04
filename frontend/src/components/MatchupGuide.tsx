import React, { useMemo } from 'react';
import styles from './MatchupGuide.module.css';
import { PLAYERS } from '../features/nfl/nflData';
import { NFLGame } from '../features/nfl/nflTypes';
import {formatDateToEastern } from '../utils/dateUtils'
import { groupGamesByStartTime } from '../features/nfl/nflUtils'
import nflSchedule from '../assets/nfl-schedule-2024.json';

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

const MatchupGuide: React.FC<MatchupGuideProps> = ({ selectedWeek, setSelectedWeek, activeFantasyTeams }) => {
  const weeklySchedule = useMemo(() => {
    const schedule = nflSchedule as NFLSchedule;
    const selectedWeekSchedule = schedule.weeks.find(week => week.weekNumber === selectedWeek);
    return selectedWeekSchedule ? groupGamesByStartTime(selectedWeekSchedule.games) : [];
  }, [selectedWeek]);

  const getFantasyPlayersForTeam = (teamName: string) => {
    return PLAYERS.filter(player => 
      player.team === teamName && 
      player.fantasyTeams.some(team => activeFantasyTeams.includes(team))
    ).map(player => ({
      ...player,
      activeFantasyTeams: player.fantasyTeams.filter(team => activeFantasyTeams.includes(team))
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className={styles['matchup-guide']}>
      <h2>Week {selectedWeek} Matchups</h2>
      {weeklySchedule.length > 0 ? (
        weeklySchedule.map(([startTime, games], index) => (
          <div key={index} className={styles['game-group']}>
            <h3>{formatDateToEastern(startTime.split(' ')[0], startTime.split(' ')[1])}</h3>
            <div className={styles['game-group-content']}>
              {games.map((game: NFLGame, gameIndex) => {
                const awayPlayers = getFantasyPlayersForTeam(game.awayTeam);
                const homePlayers = getFantasyPlayersForTeam(game.homeTeam);
                const hasPlayers = awayPlayers.length > 0 || homePlayers.length > 0;
                return (
                  <div key={gameIndex} className={styles.matchup}>
                    <div className={styles['matchup-header']}>
                      <div className={styles['team-names']}>
                        <span className={styles['away-team']}>{game.awayTeam}</span>
                        <span className={styles['at-symbol']}>@</span>
                        <span className={styles['home-team']}>{game.homeTeam}</span>
                      </div>
                    </div>
                    <div className={`${styles['matchup-content']} ${!hasPlayers ? styles['no-players-content'] : ''}`}>
                      {hasPlayers ? (
                        <div className={styles['team-players']}>
                          <div className={styles['away-team']}>
                            {awayPlayers.length > 0 ? (
                              awayPlayers.map(player => (
                                <p key={player.name} className={styles.player} title={player.activeFantasyTeams.join(', ')}>
                                  {player.name}
                                  {player.activeFantasyTeams.length > 1 && <span className={styles['multi-team']}> x{player.activeFantasyTeams.length}</span>}
                                </p>
                              ))
                            ) : (
                              <p className={styles['no-players']}>No fantasy players</p>
                            )}
                          </div>
                          <div className={styles['home-team']}>
                            {homePlayers.length > 0 ? (
                              homePlayers.map(player => (
                                <p key={player.name} className={styles.player} title={player.activeFantasyTeams.join(', ')}>
                                  {player.name}
                                  {player.activeFantasyTeams.length > 1 && <span className={styles['multi-team']}> x{player.activeFantasyTeams.length}</span>}
                                </p>
                              ))
                            ) : (
                              <p className={styles['no-players']}>No fantasy players</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className={styles['no-players']}>No fantasy players</p>
                      )}
                    </div>
                    <div className={styles['matchup-footer']}>
                      <span className={styles.channel}>{game.channel}</span>
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