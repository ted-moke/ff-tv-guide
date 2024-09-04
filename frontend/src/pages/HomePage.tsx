import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Sidebar from '../components/Sidebar';
import MatchupGuide from '../components/MatchupGuide';
import Overview from '../components/Overview'; // Import Overview component

interface FantasyTeam {
  name: string;
  league: string;
}

export const FANTASY_TEAMS: FantasyTeam[] = [
  { name: "Tulsa Tango", league: "Vince's League" },
  { name: "Papas Tatas", league: "All Star League" },
  { name: "Southie Sizzlers", league: "Forever League" },
];

export const NFL_TEAMS = {
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

export const PLAYERS = [
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

export type Conference = 'AFC' | 'NFC' | 'Both';

export type SortOption = 'division' | 'players' | 'name';

export type ViewMode = 'overview' | 'matchup';
export interface NFLGame {
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

export const formatDateToLocal = (dateString: string, timeString: string) => {
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

export const groupGamesByStartTime = (games: NFLGame[]) => {
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

export const getTeams = (conference: Conference) => {
  if (conference === 'Both') {
    return [...NFL_TEAMS.AFC, ...NFL_TEAMS.NFC];
  }
  return NFL_TEAMS[conference];
};

const HomePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('matchup');
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles['sports-dashboard']}>
      <div className={styles['mobile-header']}>
        <h1>NFL Fantasy Dashboard</h1>
        <button className={styles['mobile-menu-toggle']} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeFantasyTeams={activeFantasyTeams}
        setActiveFantasyTeams={setActiveFantasyTeams}
        activeConference={activeConference}
        setActiveConference={setActiveConference}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        hideEmptyTeams={hideEmptyTeams}
        setHideEmptyTeams={setHideEmptyTeams}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />
      <main className={styles['main-content']}>
        {viewMode === 'overview' ? (
          <Overview
            activeFantasyTeams={activeFantasyTeams}
            activeConference={activeConference}
            sortBy={sortBy}
            hideEmptyTeams={hideEmptyTeams}
          />
        ) : (
          <MatchupGuide
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            activeFantasyTeams={activeFantasyTeams}
          />
        )}
      </main>
    </div>
  );
}

export default HomePage;