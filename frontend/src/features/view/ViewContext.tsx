import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Conference } from '../nfl/nflTypes';

export type ViewMode = 'overview' | 'matchup';
export type SortOption = 'division' | 'players' | 'name';

export const FANTASY_TEAMS = [
  { name: "Tulsa Tango", league: "Vince's League" },
  { name: "Papas Tatas", league: "All Star League" },
  { name: "Southie Sizzlers", league: "Forever League" },
];

interface ViewContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  selectedConference: string | null;
  setSelectedConference: (conference: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeFantasyTeams: string[];
  setActiveFantasyTeams: (teams: string[]) => void;
  activeConference: Conference;
  setActiveConference: (conference: Conference) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  hideEmptyTeams: boolean;
  setHideEmptyTeams: (hide: boolean) => void;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

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

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('matchup');
  const [activeFantasyTeams, setActiveFantasyTeams] = useState<string[]>(FANTASY_TEAMS.map(team => team.name));
  const [activeConference, setActiveConference] = useState<Conference>('Both');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [hideEmptyTeams, setHideEmptyTeams] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    selectedConference,
    setSelectedConference,
    viewMode,
    setViewMode,
    activeFantasyTeams,
    setActiveFantasyTeams,
    activeConference,
    setActiveConference,
    sortBy,
    setSortBy,
    hideEmptyTeams,
    setHideEmptyTeams,
    selectedWeek,
    setSelectedWeek,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};