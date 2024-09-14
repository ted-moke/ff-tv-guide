import React, { useMemo } from "react";
import styles from "./Sidebar.module.css";
import LinkButton, { LinkButtonColor } from "./LinkButton";
import Checkbox from "./Checkbox";
import useUserTeams from "../features/teams/useUserTeams";
import { useView } from "../features/view/ViewContext";
import { useNavigate } from "react-router-dom";

const FantasyTeamOptions: React.FC = () => {
  const { activeFantasyTeams, setActiveFantasyTeams, setIsMenuOpen } = useView();
  const navigate = useNavigate();
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
    <div className={`${styles["control-group"]} ${styles["fantasy-team-list-wrapper"]}`}>
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
        <LinkButton color={LinkButtonColor.PRIMARY} onClick={() => {
          setIsMenuOpen(false);
          navigate("/connect-team");
        }} >+ Connect Team</LinkButton>
      </div>
    </div>
  );
};

export default FantasyTeamOptions;