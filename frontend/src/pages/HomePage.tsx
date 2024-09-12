import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Sidebar from '../components/Sidebar';
import MatchupGuide from '../components/MatchupGuide';
import Overview from '../components/Overview';
import { Conference } from '../features/nfl/nflTypes'

interface FantasyTeam {
  name: string;
  league: string;
}

export const FANTASY_TEAMS: FantasyTeam[] = [
  { name: "Tulsa Tango", league: "Vince's League" },
  { name: "Papas Tatas", league: "All Star League" },
  { name: "Southie Sizzlers", league: "Forever League" },
];

export type SortOption = 'division' | 'players' | 'name';
export type ViewMode = 'overview' | 'matchup';

// Utility functions
const getCurrentWeek = () => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const seasonStart = new Date('2024-09-03T00:00:00-04:00'); // First game of 2024 season
  
  if (easternTime < seasonStart) {
    return 1;
  }

  const weeksPassed = Math.floor((easternTime.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

  return Math.min(Math.max(weeksPassed + 1, 1), 18); // Ensure week is between 1 and 18
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