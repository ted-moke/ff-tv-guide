import React from "react";
import styles from "./FantasyTeamOptions.module.css";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import Checkbox from "../../components/ui/Checkbox";
import { useUserTeams } from "./useUserTeams";
import { useView } from "../view/ViewContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FantasyTeam } from "./teamTypes";

const FantasyTeamOptions: React.FC = () => {
  const { setIsMenuOpen, setTeamVisibility, teamVisibility } = useView();
  const navigate = useNavigate();
  const { data: userTeams, isLoading, error } = useUserTeams();
  const location = useLocation();

  const handleSelectAllFantasyTeams = () => {
    if (!userTeams) return;

    const updatedTeams: FantasyTeam[] = userTeams.map((team) => ({
      ...team,
      visibilityType: "show",
    }));

    setTeamVisibility(updatedTeams);
    updateLocalStorage(updatedTeams);
  };

  const handleClearAllFantasyTeams = () => {
    const updatedTeams: FantasyTeam[] = teamVisibility.map((team) => ({
      ...team,
      visibilityType: "hide",
    }));

    setTeamVisibility(updatedTeams);
    updateLocalStorage(updatedTeams);
  };

  const handleFantasyTeamToggle = (leagueId: string) => {
    setTeamVisibility((prev) => {
      const updatedTeams: FantasyTeam[] = prev.map((team) =>
        team.leagueId === leagueId
          ? {
              ...team,
              visibilityType: team.visibilityType === "show" ? "hide" : "show",
            }
          : team
      );

      updateLocalStorage(updatedTeams);
      return updatedTeams;
    });
  };

  const updateLocalStorage = (teams: FantasyTeam[]) => {
    const visibilityMap = teams.reduce((acc, team) => {
      acc[team.leagueId] = team.visibilityType;
      return acc;
    }, {} as Record<string, string>);
    localStorage.setItem("teamVisibility", JSON.stringify(visibilityMap));
  };

  return (
    <div className={styles["fantasy-team-list-wrapper"]}>
      <h5>Your Leagues</h5>
      {isLoading ? (
        <p>Loading leagues...</p>
      ) : error ? (
        <p>Error loading leagues: {(error as Error).message}</p>
      ) : teamVisibility.length < 1 ? (
        <div className={styles["fantasy-team-basic-list"]}>
          <p>No leagues found</p>
        </div>
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
          {teamVisibility.map((team) => (
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
