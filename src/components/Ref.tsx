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
  { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', fantasyTeam: "Tulsa Tango" },
  { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', fantasyTeam: "Papas Tatas" },
  { name: 'Aaron Rodgers', team: 'Green Bay Packers', fantasyTeam: "Southie Sizzlers" },
  { name: 'Derrick Henry', team: 'Tennessee Titans', fantasyTeam: "Tulsa Tango" },
  { name: 'Travis Kelce', team: 'Kansas City Chiefs', fantasyTeam: "Papas Tatas" },
  { name: 'Davante Adams', team: 'Las Vegas Raiders', fantasyTeam: "Southie Sizzlers" },
  { name: 'Josh Allen', team: 'Buffalo Bills', fantasyTeam: "Tulsa Tango" },
  { name: 'Tyreek Hill', team: 'Miami Dolphins', fantasyTeam: "Papas Tatas" },
  { name: 'Cooper Kupp', team: 'Los Angeles Rams', fantasyTeam: "Southie Sizzlers" },
  { name: 'Alvin Kamara', team: 'New Orleans Saints', fantasyTeam: "Tulsa Tango" },
  { name: 'Justin Jefferson', team: 'Minnesota Vikings', fantasyTeam: "Papas Tatas" },
  { name: 'Stefon Diggs', team: 'Buffalo Bills', fantasyTeam: "Southie Sizzlers" },
];

type Conference = 'AFC' | 'NFC' | 'Both';

type SortOption = 'division' | 'players' | 'name';

type ViewMode = 'overview' | 'matchup';

interface NFLGame {
  week: number;
  date: string;
  time: string;
  away_team: string;
  home_team: string;
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
  const [month, day, year] = dateString.split('/');
  const [hours, minutes] = timeString.split(':');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  return date.toLocaleString();
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
      players: PLAYERS.filter(player => player.team === team && activeFantasyTeams.includes(player.fantasyTeam)),
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
    return nflSchedule.filter(game => game.week === selectedWeek);
  }, [selectedWeek]);

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
                      <li key={player.name}>{player.name} <span className="fantasy-team">({player.fantasyTeam})</span></li>
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
            {weeklySchedule.map((game: NFLGame, index) => (
              <div key={index} className="matchup">
                <p>{game.away_team} @ {game.home_team}</p>
                <p>Date: {formatDateToLocal(game.date, game.time)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AIChatHistory;