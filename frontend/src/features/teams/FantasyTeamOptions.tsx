import React, { useMemo } from "react";
import styles from "./FantasyTeamOptions.module.css";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
// import Checkbox from "../../components/ui/Checkbox";
import { useUserTeams } from "./useUserTeams";
import { useView } from "../view/ViewContext";
import { useLocation, useNavigate } from "react-router-dom";

const FantasyTeamOptions: React.FC = () => {
  // const { activeFantasyTeams, setActiveFantasyTeams, setIsMenuOpen } = useView();
  const { setIsMenuOpen } = useView();
  const navigate = useNavigate();
  const { data: userTeams, isLoading, error } = useUserTeams();
  const location = useLocation();

  const fantasyTeams = useMemo(() => {
    if (!userTeams) return [];
    return Object.values(userTeams).map((team) => ({
      name: team.name,
      league: team.leagueName,
    }));
  }, [userTeams]);

  // const handleFantasyTeamToggle = (teamName: string) => {
  //   setActiveFantasyTeams([...activeFantasyTeams, teamName]);
  // };

  // const handleSelectAllFantasyTeams = () => {
  //   setActiveFantasyTeams(fantasyTeams.map((team) => team.name));
  // };

  // const handleClearAllFantasyTeams = () => {
  //   setActiveFantasyTeams([]);
  // };

  return (
    <div className={styles["fantasy-team-list-wrapper"]}>
      <h5>Your Leagues</h5>
      {isLoading ? (
        <p>Loading leagues...</p>
      ) : error ? (
        <p>Error loading leagues: {(error as Error).message}</p>
      ) : fantasyTeams.length < 1 ? (
        <div className={styles["fantasy-team-basic-list"]}>
          <p>No leagues found</p>
        </div>
      ) : (
        <div className={styles["fantasy-team-basic-list"]}>
          {fantasyTeams.map((team) => {
            return <p key={team.league}>{team.league}</p>;
          })}
          {/*         <div className={styles["fantasy-team-list"]}>
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
          ))} */}
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
