import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Conference } from "../nfl/nflTypes";
import { FantasyTeam } from "../teams/teamTypes";
import { useOpponentTeams } from "../teams/useUserTeams";
import { useUserTeams } from "../teams/useUserTeams";

export type ViewMode = "overview" | "matchup";
export type SortOption = "division" | "players" | "name";
export type PlayerSharesSortOption = "division" | "players" | "shares";

interface ViewContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  selectedConference: string | null;
  setSelectedConference: (conference: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  userTeamsLoading: boolean;
  opponentTeamsLoading: boolean;
  userTeamsError: Error | null;
  opponentTeamsError: Error | null;
  userTeams: FantasyTeam[];
  opponentTeams: FantasyTeam[];
  updateUserTeamVisibility: (team: FantasyTeam) => void;
  updateOpponentTeamVisibility: (team: FantasyTeam) => void;
  activeConference: Conference;
  setActiveConference: (conference: Conference) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  hideEmptyTeams: boolean;
  setHideEmptyTeams: (hide: boolean) => void;
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
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  scrollToElement: (elementId: string) => void;
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
  const seasonStart = new Date("2024-09-03T00:00:00-04:00"); // First game of 2024 season

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
  const [playerSharesSortBy, setPlayerSharesSortBy] = useState<PlayerSharesSortOption>("shares");
  const [playerSharesHideEmptyTeams, setPlayerSharesHideEmptyTeams] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [playerSharesSearchTerm, setPlayerSharesSearchTerm] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [isMobile, setIsMobile] = useState(false);
  const [userTeams, setUserTeams] = useState<FantasyTeam[]>([]);
  const [opponentTeams, setOpponentTeams] = useState<FantasyTeam[]>([]);

  const {
    data: fetchedUserTeams,
    isLoading: userTeamsLoading,
    error: userTeamsError,
  } = useUserTeams();
  const {
    data: fetchedOpponentTeams,
    isLoading: opponentTeamsLoading,
    error: opponentTeamsError,
  } = useOpponentTeams({ enabled: true });

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Element with id ${elementId} not found`);
    }
  };

  const addTeamMetadata = useCallback(
    (teams: FantasyTeam[], isUserTeams = true): FantasyTeam[] => {
      const storedTeams: FantasyTeam[] = JSON.parse(
        localStorage.getItem(isUserTeams ? "userTeams" : "opponentTeams") ||
          "[]"
      );

      const teamsWithMetadata: FantasyTeam[] = teams.map((team) => ({
        ...team,
        visibilityType:
          storedTeams && storedTeams.find((t) => t.leagueId === team.leagueId)?.visibilityType || "show",
      }));


      // Add metadata to teams that aren't on the server
      return teamsWithMetadata;
    },
    []
  );

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

  const updateUserTeamVisibility = (team: FantasyTeam) => {
    setUserTeams((prev) => {
      const updatedTeams = prev.map((t) =>
        t.leagueId === team.leagueId
          ? { ...t, visibilityType: team.visibilityType }
          : t
      );
      return updatedTeams;
    });
  };

  const updateOpponentTeamVisibility = (team: FantasyTeam) => {
    setOpponentTeams((prev) => {
      const updatedTeams = prev.map((t) =>
        t.leagueId === team.leagueId
          ? { ...t, visibilityType: team.visibilityType }
          : t
      );
      return updatedTeams;
    });
  };

  // After fetching user teams, add metadata to teams that aren't on the server
  useEffect(() => {
    if (fetchedUserTeams) {
      const updatedUserTeams = addTeamMetadata(fetchedUserTeams);
      setUserTeams(updatedUserTeams);
    }
  }, [fetchedUserTeams, setUserTeams, addTeamMetadata]);

  // After fetching opponent teams, add metadata to teams that aren't on the server
  useEffect(() => {
    if (fetchedOpponentTeams) {
      const updatedOpponentTeams = addTeamMetadata(fetchedOpponentTeams, false);
      setOpponentTeams(updatedOpponentTeams);
    }
  }, [fetchedOpponentTeams, setOpponentTeams, addTeamMetadata]);

  // Once teams update, update the local storage
  useEffect(() => {
    if (!userTeams.length) return;
    localStorage.setItem("userTeams", JSON.stringify(userTeams));
  }, [userTeams]);

  // Once opponent teams update, update the local storage
  useEffect(() => {
    if (!opponentTeams.length) return;
    localStorage.setItem("opponentTeams", JSON.stringify(opponentTeams));
  }, [opponentTeams]);

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    selectedConference,
    setSelectedConference,
    viewMode,
    setViewMode,
    teamVisibility,
    setTeamVisibility,
    activeConference,
    setActiveConference,
    sortBy,
    setSortBy,
    hideEmptyTeams,
    setHideEmptyTeams,
    // Player Shares specific state
    playerSharesSortBy,
    setPlayerSharesSortBy,
    playerSharesHideEmptyTeams,
    setPlayerSharesHideEmptyTeams,
    selectedTeams,
    setSelectedTeams,
    selectedPositions,
    setSelectedPositions,
    playerSharesSearchTerm,
    setPlayerSharesSearchTerm,
    selectedWeek,
    setSelectedWeek,
    isMobile,
    setIsMobile,
    scrollToElement,
    userTeams,
    opponentTeams,
    userTeamsLoading,
    opponentTeamsLoading,
    userTeamsError,
    opponentTeamsError,
    updateUserTeamVisibility,
    updateOpponentTeamVisibility,
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
