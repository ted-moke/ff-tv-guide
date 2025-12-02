import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Conference } from "../nfl/nflTypes";
import { FantasyTeam } from "../teams/teamTypes";
import { useOpponentTeams } from "../teams/useUserTeams";
import { useUserTeams } from "../teams/useUserTeams";
import { useTeamVisibility } from "../teams/useTeamVisibility";
import { CURRENT_SEASON } from "../../constants";
import { useLeagueStats } from "../league/useLeagueStats";
import { useMatchupPlayers } from "../players/useMatchupPlayers";
import { ProcessedGames } from "../../hooks/useProcessedSchedule";
import { usePlayers } from "../players/usePlayers";
import { Player } from "../nfl/nflTypes";
import { getCurrentWeek, hasWeekStarted, thruSundayDayGames } from "../../utils/weekUtils";
import { useWeeklySchedule } from "../../hooks/useWeeklySchedule";
import { getTeamPlayedStatusMap } from "../nfl/getTeamPlayedStatusMap";

export type ViewMode = "overview" | "matchup";
export type SortOption = "division" | "players" | "name";
export type PlayerSharesSortOption = "division" | "players" | "shares";

export type LeagueStats = {
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  averagePointsFor: number;
};

export type LeagueStatsMap = Record<string, Record<string, LeagueStats>>;

export type UserTeams = Record<string, Record<string, FantasyTeam>>;

interface ViewContextType {
  // Leagues
  leagueStats: LeagueStatsMap;
  // Teams
  userTeamsLoading: boolean;
  userTeamsPending: boolean;
  userTeamsSuccess: boolean;
  teamsIdsCurrentlyUpdating: string[];  
  opponentTeamsLoading: boolean;
  userTeamsError: Error | null;
  opponentTeamsError: Error | null;
  userTeams: UserTeams;
  opponentTeams: FantasyTeam[];
  // Players
  players: Player[];
  matchupPlayers: ProcessedGames | null;
  matchupPlayersLoading: boolean;
  matchupPlayersInitialized: boolean;
  matchupPlayersError: Error | null;
  // Team Visibility
  visibleTeams: FantasyTeam[];
  visibleOpponentTeams: FantasyTeam[];
  hideTeam: (leagueId: string) => void;
  showTeam: (leagueId: string) => void;
  hideAllTeams: () => void;
  showAllTeams: () => void;
  hideOpponentTeam: (leagueId: string) => void;
  showOpponentTeam: (leagueId: string) => void;
  // Conference
  activeConference: Conference;
  setActiveConference: (conference: Conference) => void;
  // Sort and Filter
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  hideEmptyTeams: boolean;
  setHideEmptyTeams: (hide: boolean) => void;
  selectedConference: string | null;
  setSelectedConference: (conference: string | null) => void;
  // Player Shares specific state
  playerSharesSortBy: PlayerSharesSortOption;
  setPlayerSharesSortBy: (option: PlayerSharesSortOption) => void;
  playerSharesHideEmptyTeams: boolean;
  setPlayerSharesHideEmptyTeams: (hide: boolean) => void;
  selectedTeams: string[];
  setSelectedTeams: (teams: string[]) => void;
  selectedPositions: string[];
  setSelectedPositions: (positions: string[]) => void;
  playerSharesSearchTerm: string;
  setPlayerSharesSearchTerm: (term: string) => void;
  selectedWeek: number | null;
  setSelectedWeek: (week: number) => void;
  hasWeekStarted: boolean;
  thruSundayDayGames: boolean;
  // UI Data
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  scrollToElement: (elementId: string, highlight?: boolean) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>("matchup");
  const [teamVisibility, setTeamVisibility] = useState<FantasyTeam[]>([]);
  const [activeConference, setActiveConference] = useState<Conference>("Both");
  const [sortBy, setSortBy] = useState<SortOption>("players");
  const [hideEmptyTeams, setHideEmptyTeams] = useState(false);
  // Player Shares specific state
  const [playerSharesSortBy, setPlayerSharesSortBy] =
    useState<PlayerSharesSortOption>("shares");
  const [playerSharesHideEmptyTeams, setPlayerSharesHideEmptyTeams] =
    useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [playerSharesSearchTerm, setPlayerSharesSearchTerm] =
    useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [isMobile, setIsMobile] = useState(false);

  
  
  const weeklySchedule = useWeeklySchedule(selectedWeek || 0);

  const teamPlayedStatusMap = useMemo(() => {
    return getTeamPlayedStatusMap(weeklySchedule);
  }, [weeklySchedule]);

  const {
    data: fetchedUserTeams,
    isLoading: userTeamsLoading,
    isPending: userTeamsPending,
    isSuccess: userTeamsSuccess,
    error: userTeamsError,
    teamMap,
    teamsIdsCurrentlyUpdating,
  } = useUserTeams({ teamPlayedStatusMap });
  const {
    data: fetchedOpponentTeams,
    isLoading: opponentTeamsLoading,
    error: opponentTeamsError,
  } = useOpponentTeams({ enabled: true, teamPlayedStatusMap });

  const leagueStats = useLeagueStats({
    userTeams: teamMap,
  });



  const {
    visibleTeams,
    visibleOpponentTeams,
    hideTeam,
    showTeam,
    hideAllTeams,
    showAllTeams,
    hideOpponentTeam,
    showOpponentTeam,
  } = useTeamVisibility({
    userTeams: fetchedUserTeams?.teamsBySeason?.[CURRENT_SEASON] || [],
    opponentTeams: fetchedOpponentTeams || [],
  });

  const { players } = usePlayers({
    selfTeams: visibleTeams,
    opponentTeams: visibleOpponentTeams,
    teamPlayedStatusMap,
  });

  const {
    matchupPlayers,
    isLoading: matchupPlayersLoading,
    initialized: matchupPlayersInitialized,
    error: matchupPlayersError,
  } = useMatchupPlayers({
    weeklySchedule,
    players: players || [],
  });

  const scrollToElement = (elementId: string, highlight = false) => {
    const element = document.getElementById(elementId);

    if (element) {
      if (highlight) {
        element.classList.add("highlight");
      } else {
        element.classList.remove("highlight");
      }
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Element with id ${elementId} not found`);
    }
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const hasWeekStartedValue = useMemo(() => hasWeekStarted(), []);

  const thruSundayDayGamesValue = useMemo(() => {
    return thruSundayDayGames();
  }, []);

  const value = {
    // League Stats
    leagueStats,
    // Teams
    userTeams: teamMap,
    opponentTeams: fetchedOpponentTeams || [],
    userTeamsLoading,
    userTeamsPending,
    userTeamsSuccess,
    opponentTeamsLoading,
    userTeamsError,
    opponentTeamsError,
    teamsIdsCurrentlyUpdating,
    // Team Visibility
    visibleTeams,
    visibleOpponentTeams,
    hideTeam,
    showTeam,
    hideAllTeams,
    showAllTeams,
    hideOpponentTeam,
    showOpponentTeam,
    teamVisibility,
    setTeamVisibility,
    hideEmptyTeams,
    setHideEmptyTeams,
    // Players
    players,
    matchupPlayers,
    matchupPlayersLoading,
    matchupPlayersInitialized,
    matchupPlayersError,
    // Player Shares specific state
    playerSharesSortBy,
    setPlayerSharesSortBy,
    playerSharesHideEmptyTeams,
    setPlayerSharesHideEmptyTeams,
    // Filters
    selectedTeams,
    setSelectedTeams,
    selectedPositions,
    setSelectedPositions,
    playerSharesSearchTerm,
    setPlayerSharesSearchTerm,
    activeConference,
    setActiveConference,
    sortBy,
    setSortBy,
    // Selected Week
    selectedWeek,
    setSelectedWeek,
    hasWeekStarted: hasWeekStartedValue,
    thruSundayDayGames: thruSundayDayGamesValue,
    // Mobile
    isMobile,
    setIsMobile,
    // Utility
    scrollToElement,
    scrollToTop,

    // UI Data
    isMenuOpen,
    setIsMenuOpen,
    selectedConference,
    setSelectedConference,
    viewMode,
    setViewMode,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};
