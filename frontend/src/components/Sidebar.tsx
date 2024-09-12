import React, { useMemo } from "react";
import styles from "./Sidebar.module.css";
import { SortOption, ViewMode } from "../pages/HomePage";
import { Conference } from "../features/nfl/nflTypes";
import LinkButton, { LinkButtonColor } from "./LinkButton";
import MenuItem from "./MenuItem";
import Checkbox from "./Checkbox";
import Dropdown from "./Dropdown";
import useUserTeams from "../features/teams/useUserTeams";

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeFantasyTeams: string[];
  setActiveFantasyTeams: (teams: string[]) => void;
  activeConference: Conference;
  setActiveConference: (conference: Conference) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  isMobileMenuOpen: boolean;
  hideEmptyTeams: boolean;
  setHideEmptyTeams: (hide: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  setViewMode,
  activeFantasyTeams,
  setActiveFantasyTeams,
  activeConference,
  setActiveConference,
  sortBy,
  setSortBy,
  isMobileMenuOpen,
  hideEmptyTeams,
  setHideEmptyTeams,
}) => {
  const { data: userTeams, isLoading, error } = useUserTeams();

  const fantasyTeams = useMemo(() => {
    if (!userTeams) return [];
    return Object.values(userTeams).map((team) => ({
      name: team.name,
      league: team.leagueName,
    }));
  }, [userTeams]);

  const handleFantasyTeamToggle = (teamName: string) => {
    setActiveFantasyTeams([...activeFantasyTeams, teamName]);
  };

  const handleSelectAllFantasyTeams = () => {
    setActiveFantasyTeams(fantasyTeams.map((team) => team.name));
  };

  const handleClearAllFantasyTeams = () => {
    setActiveFantasyTeams([]);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}
    >
      <div className={styles["control-group"]}>
        <MenuItem
          text="TV Guide"
          to="#"
          isActive={viewMode === "matchup"}
          onClick={() => setViewMode("matchup")}
        />
        <MenuItem
          text="NFL Teams"
          to="#"
          isActive={viewMode === "overview"}
          onClick={() => setViewMode("overview")}
        />
      </div>
      {viewMode === "overview" && (
        <>
          <div className={styles["control-group"]}>
            <h3>Conference</h3>
            <div className={styles["conference-tabs"]}>
              {(["AFC", "NFC", "Both"] as Conference[]).map((conf) => (
                <MenuItem
                  key={conf}
                  text={conf}
                  to="#"
                  isActive={activeConference === conf}
                  onClick={() => setActiveConference(conf)}
                />
              ))}
            </div>
          </div>
          <div className={styles["control-group"]}>
            <h3>Sort By</h3>
            <Dropdown
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={[
                { value: "name", label: "Team Name" },
                { value: "division", label: "Division" },
                { value: "players", label: "Number of Players" },
              ]}
            />
          </div>
          <div className={styles["control-group"]}>
            <h3>Display Options</h3>
            <Checkbox
              id="hideEmptyTeams"
              checked={hideEmptyTeams}
              onChange={() => setHideEmptyTeams(!hideEmptyTeams)}
              label="Hide teams with no players"
            />
          </div>
        </>
      )}
      <div
        className={`${styles["control-group"]} ${styles["fantasy-team-list-wrapper"]}`}
      >
        <h3>Fantasy Leagues</h3>
        {isLoading ? (
          <p>Loading leagues...</p>
        ) : error ? (
          <p>Error loading leagues: {(error as Error).message}</p>
        ) : (
          <div className={styles["fantasy-team-list"]}>
            <div className={styles["fantasy-team-actions"]}>
              <LinkButton onClick={handleSelectAllFantasyTeams}>
                Select All
              </LinkButton>
              <LinkButton onClick={handleClearAllFantasyTeams}>
                Clear All
              </LinkButton>
            </div>
            {fantasyTeams.map((team) => (
              <Checkbox
                key={team.league}
                id={team.league}
                checked={activeFantasyTeams.includes(team.league)}
                onChange={() => handleFantasyTeamToggle(team.league)}
                label={`${team.league}`}
              />
            ))}
          </div>
        )}
        <div className={styles["connect-team-container"]}>
          <LinkButton color={LinkButtonColor.PRIMARY} to="/connect-team">+ Connect Team</LinkButton>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
