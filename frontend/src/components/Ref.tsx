import React, { useState, useMemo, useEffect } from 'react';
import './Ref.css';
import nflSchedule from '../assets/nfl-schedule-2024.json';

interface FantasyTeam {
  name: string;
  league: string;
}

const FANTASY_TEAMS: FantasyTeam[] = [
  { name: "Tulsa Tango", league: "Vince's League" },
  { name: "Papas Tatas", league: "All Star League" },
  { name: "Southie Sizzlers", league: "Forever League" },
];

const NFL_TEAMS = {
  AFC: [
    'Buffalo Bills', 'Miami Dolphins', 'New England Patriots', 'New York Jets',
    'Baltimore Ravens', 'Cincinnati Bengals', 'Cleveland Browns', 'Pittsburgh Steelers',
    'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Tennessee Titans',
    'Denver Broncos', 'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers'
  ],
  NFC: [
    'Dallas Cowboys', 'New York Giants', 'Philadelphia Eagles', 'Washington Commanders',
    'Chicago Bears', 'Detroit Lions', 'Green Bay Packers', 'Minnesota Vikings',
    'Atlanta Falcons', 'Carolina Panthers', 'New Orleans Saints', 'Tampa Bay Buccaneers',
    'Arizona Cardinals', 'Los Angeles Rams', 'San Francisco 49ers', 'Seattle Seahawks'
  ]
};

const PLAYERS = [
  { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', fantasyTeams: ["Tulsa Tango", "Papas Tatas"] },
  { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', fantasyTeams: ["Papas Tatas", "Southie Sizzlers", "Tulsa Tango"] },
  { name: 'Aaron Rodgers', team: 'Green Bay Packers', fantasyTeams: ["Southie Sizzlers"] },
  { name: 'Derrick Henry', team: 'Tennessee Titans', fantasyTeams: ["Tulsa Tango", "Papas Tatas"] },
  { name: 'Travis Kelce', team: 'Kansas City Chiefs', fantasyTeams: ["Papas Tatas"] },
  { name: 'Davante Adams', team: 'Las Vegas Raiders', fantasyTeams: ["Southie Sizzlers", "Tulsa Tango"] },
  { name: 'Josh Allen', team: 'Buffalo Bills', fantasyTeams: ["Tulsa Tango"] },
  { name: 'Tyreek Hill', team: 'Miami Dolphins', fantasyTeams: ["Papas Tatas"] },
  { name: 'Cooper Kupp', team: 'Los Angeles Rams', fantasyTeams: ["Southie Sizzlers"] },
  { name: 'Alvin Kamara', team: 'New Orleans Saints', fantasyTeams: ["Tulsa Tango"] },
  { name: 'Justin Jefferson', team: 'Minnesota Vikings', fantasyTeams: ["Papas Tatas", "Southie Sizzlers"] },
  { name: 'Stefon Diggs', team: 'Buffalo Bills', fantasyTeams: ["Southie Sizzlers"] },
];

type Conference = 'AFC' | 'NFC' | 'Both';

type SortOption = 'division' | 'players' | 'name';

type ViewMode = 'overview' | 'matchup';

interface NFLSchedule {
  season: number;
  weeks: {
    weekNumber: number;
    games: NFLGame[];
  }[];
}

interface NFLGame {
  date: string;
  time: string;
  awayTeam: string;
  homeTeam: string;
  location: string | null;
  channel: string;
}

// Utility functions
const getCurrentWeek = () => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const seasonStart = new Date('2024-09-05T00:00:00-04:00'); // First game of 2024 season
  
  if (easternTime < seasonStart) {
    return 1;
  }

  const weeksPassed = Math.floor((easternTime.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(weeksPassed + 1, 1), 18); // Ensure week is between 1 and 18
};

const formatDateToLocal = (dateString: string, timeString: string) => {
  const [year, month, day] = dateString.split('-');
  const [hours, minutes] = timeString.split(':');
  const date = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours) + 4, // Convert EDT to UTC
    parseInt(minutes)
  ));
  
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const groupGamesByStartTime = (games: NFLGame[]) => {
  const groupedGames: { [key: string]: NFLGame[] } = {};
  games.forEach(game => {
    const key = `${game.date} ${game.time}`;
    if (!groupedGames[key]) {
      groupedGames[key] = [];
    }
    groupedGames[key].push(game);
  });
  return Object.entries(groupedGames).sort(([a], [b]) => {
    const dateA = new Date(a.replace(' ', 'T') + 'Z');
    const dateB = new Date(b.replace(' ', 'T') + 'Z');
    return dateA.getTime() - dateB.getTime();
  });
};

const AIChatHistory: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [activeFantasyTeams, setActiveFantasyTeams] = useState<string[]>(FANTASY_TEAMS.map(team => team.name));
  const [activeConference, setActiveConference] = useState<Conference>('Both');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hideEmptyTeams, setHideEmptyTeams] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  useEffect(() => {
    // Update selected week when view mode changes to matchup
    if (viewMode === 'matchup') {
      setSelectedWeek(getCurrentWeek());
    }
  }, [viewMode]);

  const handleFantasyTeamToggle = (teamName: string) => {
    setActiveFantasyTeams(prev => 
      prev.includes(teamName) 
        ? prev.filter(name => name !== teamName)
        : [...prev, teamName]
    );
  };

  const handleSelectAllFantasyTeams = () => {
    setActiveFantasyTeams(FANTASY_TEAMS.map(team => team.name));
  };

  const handleClearAllFantasyTeams = () => {
    setActiveFantasyTeams([]);
  };

  const getTeams = (conference: Conference) => {
    if (conference === 'Both') {
      return [...NFL_TEAMS.AFC, ...NFL_TEAMS.NFC];
    }
    return NFL_TEAMS[conference];
  };

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
    <div className="sports-dashboard">
      <div className="mobile-header">
        <h1>NFL Fantasy Dashboard</h1>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <h2>Controls</h2>
        <div className="control-group view-toggle">
          <button 
            className={viewMode === 'overview' ? 'active' : ''}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </button>
          <button 
            className={viewMode === 'matchup' ? 'active' : ''}
            onClick={() => setViewMode('matchup')}
          >
            Matchup Guide
          </button>
        </div>
        {viewMode === 'overview' ? (
          <>
            <div className="control-group">
              <h3>Conference</h3>
              <div className="conference-tabs">
                {(['AFC', 'NFC', 'Both'] as Conference[]).map(conf => (
                  <button 
                    key={conf}
                    className={activeConference === conf ? 'active' : ''} 
                    onClick={() => setActiveConference(conf)}
                  >
                    {conf}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <h3>Sort By</h3>
              <div className="sort-dropdown">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                  <option value="name">Team Name</option>
                  <option value="division">Division</option>
                  <option value="players">Number of Players</option>
                </select>
              </div>
            </div>
            <div className="control-group">
              <h3>Display Options</h3>
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={hideEmptyTeams}
                  onChange={() => setHideEmptyTeams(!hideEmptyTeams)}
                />
                Hide teams with no players
              </label>
            </div>
          </>
        ) : (
          <div className="control-group">
            <h3>Select Week</h3>
            <select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
            >
              {Array.from({length: 18}, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
        )}
        <div className="control-group">
          <h3>Fantasy Teams</h3>
          <div className="fantasy-team-list">
            <div className="fantasy-team-actions">
              <button onClick={handleSelectAllFantasyTeams}>Select All</button>
              <button onClick={handleClearAllFantasyTeams}>Clear All</button>
            </div>
            {FANTASY_TEAMS.map(team => (
              <label key={team.name} className="fantasy-team-item">
                <input
                  type="checkbox"
                  checked={activeFantasyTeams.includes(team.name)}
                  onChange={() => handleFantasyTeamToggle(team.name)}
                />
                {team.name} ({team.league})
              </label>
            ))}
          </div>
        </div>
      </aside>
      <main className="main-content">
        {viewMode === 'overview' ? (
          <div className="teams-grid">
            {sortedGroupedPlayers.map(({ team, players, division }) => (
              <div key={team} className="team-card">
                <h2>
                  {team}
                  <span className="player-count">({players.length})</span>
                </h2>
                <p className="division">{division}</p>
                {players.length > 0 ? (
                  <ul>
                    {players.map(player => (
                      <li key={player.name} title={player.fantasyTeams.join(', ')}>
                        {player.name}
                        {player.fantasyTeams.length > 1 && <span className="multi-team"> x{player.fantasyTeams.length}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-players">No fantasy players in this team</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="matchup-guide">
            <h2>Week {selectedWeek} Matchups</h2>
            {weeklySchedule.length > 0 ? (
              weeklySchedule.map(([startTime, games], index) => (
                <div key={index} className="game-group">
                  <h3>{formatDateToLocal(startTime.split(' ')[0], startTime.split(' ')[1])}</h3>
                  <div className="game-group-content">
                    {games.map((game: NFLGame, gameIndex) => {
                      const awayPlayers = getFantasyPlayersForTeam(game.awayTeam);
                      const homePlayers = getFantasyPlayersForTeam(game.homeTeam);
                      const hasPlayers = awayPlayers.length > 0 || homePlayers.length > 0;
                      return (
                        <div key={gameIndex} className="matchup">
                          <div className="matchup-header">
                            <div className="team-names">
                              <span className="away-team">{game.awayTeam}</span>
                              <span className="at-symbol">@</span>
                              <span className="home-team">{game.homeTeam}</span>
                            </div>
                          </div>
                          <div className={`matchup-content ${!hasPlayers ? 'no-players-content' : ''}`}>
                            {hasPlayers ? (
                              <div className="team-players">
                                <div className="team away-team">
                                  {awayPlayers.length > 0 ? (
                                    awayPlayers.map(player => (
                                      <p key={player.name} className="player" title={player.activeFantasyTeams.join(', ')}>
                                        {player.name}
                                        {player.activeFantasyTeams.length > 1 && <span className="multi-team"> x{player.activeFantasyTeams.length}</span>}
                                      </p>
                                    ))
                                  ) : (
                                    <p className="no-players">No fantasy players</p>
                                  )}
                                </div>
                                <div className="team home-team">
                                  {homePlayers.length > 0 ? (
                                    homePlayers.map(player => (
                                      <p key={player.name} className="player" title={player.activeFantasyTeams.join(', ')}>
                                        {player.name}
                                        {player.activeFantasyTeams.length > 1 && <span className="multi-team"> x{player.activeFantasyTeams.length}</span>}
                                      </p>
                                    ))
                                  ) : (
                                    <p className="no-players">No fantasy players</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="no-players">No fantasy players</p>
                            )}
                          </div>
                          <div className="matchup-footer">
                            <span className="channel">{game.channel}</span>
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
        )}
      </main>
    </div>
  );
}

export default AIChatHistory;