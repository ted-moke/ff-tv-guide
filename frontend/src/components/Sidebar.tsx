import React from "react";
import styles from "./Sidebar.module.css";
import { FANTASY_TEAMS, Conference, SortOption, ViewMode } from "../pages/HomePage";
import LinkButton from './LinkButton';
import MenuItem from './MenuItem';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import logo from '/vite.svg';

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
  toggleMobileMenu: () => void;
  hideEmptyTeams: boolean;
  setHideEmptyTeams: (hide: boolean) => void;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
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
  toggleMobileMenu,
  hideEmptyTeams,
  setHideEmptyTeams,
  selectedWeek,
  setSelectedWeek,
}) => {
  const handleFantasyTeamToggle = (teamName: string) => {
    setActiveFantasyTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((name) => name !== teamName)
        : [...prev, teamName]
    );
  };

  const handleSelectAllFantasyTeams = () => {
    setActiveFantasyTeams(FANTASY_TEAMS.map((team) => team.name));
  };

  const handleClearAllFantasyTeams = () => {
    setActiveFantasyTeams([]);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}
    >
      <div className={styles.branding}>
        <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
        <h1 className={styles.title}>FF TV Guide</h1>
      </div>
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
      {viewMode === "overview" ? (
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
                { value: 'name', label: 'Team Name' },
                { value: 'division', label: 'Division' },
                { value: 'players', label: 'Number of Players' },
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
      ) : (
        <div className={styles["control-group"]}>
          <h3>Select Week</h3>
          <Dropdown
            id="selectedWeek"
            value={selectedWeek.toString()}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            options={Array.from({ length: 18 }, (_, i) => ({
              value: (i + 1).toString(),
              label: `Week ${i + 1}`,
            }))}
          />
        </div>
      )}
      <div className={`${styles["control-group"]} ${styles["fantasy-team-list-wrapper"]}`}>        <h3>Fantasy Teams</h3>
        <div className={styles["fantasy-team-list"]}>
          <div className={styles["fantasy-team-actions"]}>
            <LinkButton onClick={handleSelectAllFantasyTeams}>Select All</LinkButton>
            <LinkButton onClick={handleClearAllFantasyTeams}>Clear All</LinkButton>
          </div>
          {FANTASY_TEAMS.map((team) => (
            <Checkbox
              key={team.name}
              id={team.name}
              checked={activeFantasyTeams.includes(team.name)}
              onChange={() => handleFantasyTeamToggle(team.name)}
              label={`${team.name} (${team.league})`}
            />
          ))}
        </div>
        <LinkButton to="/connect-team">
          Connect Team
        </LinkButton>
      </div>
    </aside>
  );
};

export default Sidebar;
