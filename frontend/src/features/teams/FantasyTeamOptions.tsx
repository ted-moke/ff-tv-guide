import React from "react";
import styles from "./FantasyTeamOptions.module.css";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import Checkbox from "../../components/ui/Checkbox";
import { useView } from "../view/ViewContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FantasyTeam } from "./teamTypes";
import { useTeamVisibility } from "./useTeamVisibility";
import { Stack } from "../../components/ui/Stack";
import { FantasyTeamOption } from "./FantasyTeamOption";

const FantasyTeamOptions: React.FC = () => {
  const { setIsMenuOpen, userTeams, userTeamsLoading, userTeamsError } =
    useView();
  const {
    visibleTeams,
    hideTeam,
    showTeam,
    hideAllTeams,
    showAllTeams,
    visibleOpponentTeams,
    hideOpponentTeam,
    showOpponentTeam,
  } = useTeamVisibility();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectAllFantasyTeams = () => {
    if (!userTeams) return;
  };

  return (
    <div className={styles["fantasy-team-list-wrapper"]}>
      <h5>Your Leagues</h5>
      {userTeamsLoading ? (
        <p>Loading leagues...</p>
      ) : userTeamsError ? (
        <p>Error loading leagues: {(userTeamsError as Error).message}</p>
      ) : userTeams.length < 1 ? (
        <div className={styles["fantasy-team-basic-list"]}>
          <p>No leagues found</p>
        </div>
      ) : (
        <div className={styles["fantasy-team-list"]}>
          <div className={styles["fantasy-team-actions"]}>
            <LinkButton onClick={hideAllTeams}>Hide All</LinkButton>
            <LinkButton onClick={showAllTeams}>Show All</LinkButton>
          </div>
          {userTeams.map((team) => {
            const isVisible = visibleTeams.some(
              (t) => t.leagueId === team.leagueId
            );
            const isOpponentVisible = visibleOpponentTeams.some(
              (t) => t.leagueId === team.leagueId
            );
            return (
              <FantasyTeamOption
                key={team.leagueId}
                team={team}
                isVisible={isVisible}
                isOpponentVisible={isOpponentVisible}
                showTeam={showTeam}
                hideTeam={hideTeam}
                showOpponentTeam={showOpponentTeam}
                hideOpponentTeam={hideOpponentTeam}
              />
            );
          })}
        </div>
      )}
      {location.pathname !== "/connect-team" && (
        <div className={styles["connect-team-container"]}>
          <LinkButton
            color={LinkButtonColor.PRIMARY}
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/connect-team");
            }}
          >
            + Connect a League
          </LinkButton>
        </div>
      )}
    </div>
  );
};

export default FantasyTeamOptions;
