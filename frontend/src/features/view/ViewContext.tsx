import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Conference } from "../nfl/nflTypes";
import { FantasyTeam } from "../teams/teamTypes";
import { useOpponentTeams } from "../teams/useUserTeams";
import { useUserTeams } from "../teams/useUserTeams";
import { useTeamVisibility } from "../teams/useTeamVisibility";
import { CURRENT_SEASON } from "../../constants";
import { useLeagueStats } from "../league/useLeagueStats";

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
  opponentTeamsLoading: boolean;
  userTeamsError: Error | null;
  opponentTeamsError: Error | null;
  userTeams: UserTeams;
  opponentTeams: FantasyTeam[];
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
  // UI Data
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  scrollToElement: (elementId: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

const getCurrentWeek = () => {
  const now = new Date();
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const seasonStart = new Date("2025-09-03T00:00:00-04:00"); // First game of 2025 season
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  // If the current date is more than 3 days before the season start, return null
  if (easternTime < new Date(seasonStart.getTime() - THREE_DAYS)) {
    return null;
  }

  if (easternTime < seasonStart) {
    return 1;
  }

  const weeksPassed = Math.floor(
    (easternTime.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  if (weeksPassed >= 19) {
    return null;
  }

  return Math.min(Math.max(weeksPassed + 1, 1), 18); // Ensure week is between 1 and 18
};

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

  const {
    data: fetchedUserTeams,
    isLoading: userTeamsLoading,
    isPending: userTeamsPending,
    error: userTeamsError,
    teamMap,
  } = useUserTeams();
  const {
    data: fetchedOpponentTeams,
    isLoading: opponentTeamsLoading,
    error: opponentTeamsError,
  } = useOpponentTeams({ enabled: true });

  const leagueStats = useLeagueStats({
    userTeams: teamMap,
  });

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Element with id ${elementId} not found`);
    }
  };

  // const addTeamMetadata = useCallback(
  //   (teams: FantasyTeam[], isUserTeams = true): FantasyTeam[] => {
  //     const storedTeams: FantasyTeam[] = JSON.parse(
  //       localStorage.getItem(isUserTeams ? "userTeams" : "opponentTeams") ||
  //         "[]"
  //     );

  //     const teamsWithMetadata: FantasyTeam[] = teams.map((team) => ({
  //       ...team,
  //       visibilityType:
  //         (storedTeams &&
  //           storedTeams.find((t) => t.leagueId === team.leagueId)
  //             ?.visibilityType) ||
  //         "show",
  //     }));

  //     // Add metadata to teams that aren't on the server
  //     return teamsWithMetadata;
  //   },
  //   []
  // );

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

  // const userTeamsWithMetadata = useMemo(() => {
  //   if (!fetchedUserTeams) return [];
  //   return addTeamMetadata(fetchedUserTeams);
  // }, [fetchedUserTeams, addTeamMetadata]);

  // const opponentTeamsWithMetadata = useMemo(() => {
  //   if (!fetchedOpponentTeams) return [];
  //   return addTeamMetadata(fetchedOpponentTeams, false);
  // }, [fetchedOpponentTeams, addTeamMetadata]);

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
    userTeams: fetchedUserTeams?.teamsBySeason[CURRENT_SEASON] || [],
    opponentTeams: fetchedOpponentTeams || [],
  });

  const value = {
    // League Stats
    leagueStats,
    // Teams
    userTeams: teamMap,
    opponentTeams: fetchedOpponentTeams || [],
    userTeamsLoading,
    userTeamsPending,
    opponentTeamsLoading,
    userTeamsError,
    opponentTeamsError,
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
    // Mobile
    isMobile,
    setIsMobile,
    // Utility
    scrollToElement,

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
