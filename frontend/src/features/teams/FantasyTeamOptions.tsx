import React from "react";
import styles from "./FantasyTeamOptions.module.css";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import Checkbox from "../../components/ui/Checkbox";
import { useView } from "../view/ViewContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FantasyTeam } from "./teamTypes";

const FantasyTeamOptions: React.FC = () => {
  const {
    setIsMenuOpen,
    updateUserTeamVisibility,
    updateOpponentTeamVisibility,
    userTeams,
    userTeamsLoading,
    userTeamsError,
  } = useView();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectAllFantasyTeams = () => {
    if (!userTeams) return;

    const updatedTeams: FantasyTeam[] = userTeams.map((team) => ({
      ...team,
      visibilityType: "show",
    }));

    updatedTeams.forEach((team) => {
      updateUserTeamVisibility(team);
      updateOpponentTeamVisibility(team);
    });
  };

  const handleClearAllFantasyTeams = () => {
    const updatedTeams: FantasyTeam[] = userTeams.map((team) => ({
      ...team,
      visibilityType: "hide",
    }));

    updatedTeams.forEach((team) => {
      updateUserTeamVisibility(team);
      updateOpponentTeamVisibility(team);
    });
  };

  const handleFantasyTeamToggle = (leagueId: string) => {
    const team = userTeams.find((team) => team.leagueId === leagueId);
    if (!team) return;

    const updatedTeam: FantasyTeam = {
      ...team,
      visibilityType: team.visibilityType === "show" ? "hide" : "show",
    };
    updateUserTeamVisibility(updatedTeam);
    updateOpponentTeamVisibility(updatedTeam);
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
            <LinkButton onClick={handleClearAllFantasyTeams}>
              Hide All
            </LinkButton>
            <LinkButton onClick={handleSelectAllFantasyTeams}>
              Show All
            </LinkButton>
          </div>
          {userTeams.map((team) => (
            <Checkbox
              key={team.leagueId}
              id={team.leagueId}
              checked={team.visibilityType === "show"}
              onChange={() => handleFantasyTeamToggle(team.leagueId)}
              label={`${team.leagueName}`}
            />
          ))}
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
