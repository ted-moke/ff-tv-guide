import React from "react";
import styles from "./Sidebar.module.css";
import MenuItem from "./ui/MenuItem";
import { useView } from "../features/view/ViewContext";
import FantasyTeamOptions from "../features/teams/FantasyTeamOptions";
import { useAuthContext } from "../features/auth/AuthProvider2";

import Button, { ButtonColor } from "./ui/Button";
import { useLocation } from "react-router-dom";
import FFTVGLogo from "../assets/FFTVGLogo";
import { LuBookOpen, LuMessageCircle, LuPlug, LuUsers } from "react-icons/lu";

const Sidebar: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen, showAllTeams } = useView();

  const location = useLocation();
  const { logout, user } = useAuthContext();

  return (
    <aside
      className={`${styles.sidebar} ${styles.scrollbar} ${
        isMenuOpen ? styles.open : ""
      } asdflk`}
    >
      <div className={styles["sidebar-wrapper"]}>
        <div className={styles["sidebar-header"]}>
          <FFTVGLogo withText />
        </div>
        <div className={styles["control-group"]}>
          <MenuItem
            text="TV Guide"
            to="/"
            icon={
              // <FFTVGLogo
              //   size="xxsmall"
              //   withLogoText={false}
              //   color={
              //     location.pathname === "/"
              //       ? "var(--primary-color)"
              //       : "var(--text-color)"
              //   }
              // />
              <LuBookOpen size={24} color={location.pathname === "/" ? "var(--primary-color)" : "var(--text-color)"} />
            }
            isActive={location.pathname === "/"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="Player Shares"
            to="/player-shares"
            icon={
              <LuUsers
                size={24}
                color={
                  location.pathname === "/player-shares"
                    ? "var(--primary-color)"
                    : "var(--text-color)"
                }
              />
            }
            isActive={location.pathname === "/player-shares"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          {/* <MenuItem
            text="Team History"
            to="/history/teams"
            isActive={location.pathname === "/history/teams"}
            onClick={() => {
              setIsMenuOpen(false);
            }}
          /> */}
          <MenuItem
            text="Connect a League"
            to="/connect-team"
            isActive={location.pathname === "/connect-team"}
            icon={
              <LuPlug
                size={24}
                color={
                  location.pathname === "/connect-team"
                    ? "var(--primary-color)"
                    : "var(--text-color)"
                }
              />
            }
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <MenuItem
            text="Give Feedback"
            to="#"
            isActive={location.pathname === "/feedback"}
            icon={
              <LuMessageCircle
                size={24}
                color={
                  location.pathname === "/feedback"
                    ? "var(--primary-color)"
                    : "var(--text-color)"
                }
              />
            }
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
          {user && !user.isAnonymous ? (
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
              {/* <p className={styles["temp-user-message"]}>
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
              </Button> */}
              {user && user.isAnonymous && (
                <Button
                  color={ButtonColor.CLEAR}
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    showAllTeams();
                  }}
                >
                  Clear data
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
