import React from "react";
import styles from "./Sidebar.module.css";
import { Conference } from "../features/nfl/nflTypes";
import MenuItem from "./ui/MenuItem";
import Checkbox from "./ui/Checkbox";
import Dropdown from "./ui/Dropdown";
import { SortOption, useView } from "../features/view/ViewContext";
import FantasyTeamOptions from "../features/teams/FantasyTeamOptions";
// import LinkButton from "./LinkButton";
import { useAuth } from "../features/auth/useAuth";
import Button, { ButtonColor } from "./ui/Button";
import { useLocation, Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const {
    viewMode,
    // setViewMode,
    activeConference,
    setActiveConference,
    sortBy,
    setSortBy,
    hideEmptyTeams,
    setHideEmptyTeams,
    isMenuOpen,
    setIsMenuOpen,
  } = useView();

  const location = useLocation();

  const { logout, user } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""}`}>
      <div className={styles["sidebar-wrapper"]}>
        <div className={styles["control-group"]}>
          <MenuItem
            text="TV Guide"
            to="/"
            isActive={location.pathname === "/"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          {/* <MenuItem
          text="NFL Teams"
          to="/nfl"
          isActive={location.pathname === "/nfl"}
          onClick={() => {
            setIsMenuOpen(false);
          }}
        /> */}
          <MenuItem
            text="Connect a League"
            to="/connect-team"
            isActive={location.pathname === "/connect-team"}
            onClick={() => setIsMenuOpen(false)}
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
        <FantasyTeamOptions />
        <div className={`${styles["divider"]} ${styles["divider-no-margin"]}`} />
        <div className={styles["mobile-menu-items"]}>
          {user && !user.isTemporary ? (
            <Button
              color={ButtonColor.CLEAR}
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <p className={styles["temp-user-message"]}>
                Create a free account to sync your leagues cross device and reap
                the full benefits of FF TV Guide
              </p>
              <Button
                color={ButtonColor.PRIMARY}
                link="/auth?register=true"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Account
              </Button>
              <Button
                color={ButtonColor.CLEAR}
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                Clear data
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
