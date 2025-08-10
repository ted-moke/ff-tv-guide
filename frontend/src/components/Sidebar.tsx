import React from "react";
import styles from "./Sidebar.module.css";
import MenuItem from "./ui/MenuItem";
import { useView } from "../features/view/ViewContext";
import FantasyTeamOptions from "../features/teams/FantasyTeamOptions";
import { useAuthContext } from "../features/auth/AuthProvider";

import Button, { ButtonColor } from "./ui/Button";
import { useLocation } from "react-router-dom";
import FFTVGLogo from "../assets/FFTVGLogo";

const Sidebar: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useView();

  const location = useLocation();
  const { logout, user } = useAuthContext();

  return (
    <aside className={`${styles.sidebar} ${styles.scrollbar} ${isMenuOpen ? styles.open : ""} asdflk`}>
      <div className={styles["sidebar-wrapper"]}>
        <div className={styles["sidebar-header"]}>
          <FFTVGLogo withText />
        </div>
        <div className={styles["control-group"]}>
          <MenuItem
            text="TV Guide"
            to="/"
            isActive={location.pathname === "/"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="NFL Teams"
            to="/nfl-teams"
            isActive={location.pathname === "/nfl-teams"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="Player Shares"
            to="/player-shares"
            isActive={location.pathname === "/player-shares"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="Connect a League"
            to="/connect-team"
            isActive={location.pathname === "/connect-team"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="Give Feedback"
            to="#"
            isActive={location.pathname === "/feedback"}
            onClick={() => {
              setIsMenuOpen(false);
              window.open("https://forms.gle/pyzeCWTD6J5rWyGc9", "_blank");
            }}
          />
        </div>
        {user && <FantasyTeamOptions />}

        <div
          className={`${styles["divider"]} ${styles["divider-no-margin"]}`}
        />
        <div className={styles["menu-items"]}>
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
                To sync your leagues cross device and reap the full benefits of
                FF TV Guide, create a free account.
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
                link="/auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
