import React, { useState } from "react";
import styles from "./FantasyTeamOptions.module.css";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import { useView } from "../view/ViewContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FantasyTeamOption } from "./FantasyTeamOption";
import { CURRENT_SEASON } from "../../constants";
import { Stack } from "../../components/ui/Stack";

const FantasyTeamOptions: React.FC = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const {
    setIsMenuOpen,
    userTeams,
    userTeamsLoading,
    userTeamsError,
    visibleTeams,
    hideTeam,
    showTeam,
    // hideAllTeams,
    // showAllTeams,
    visibleOpponentTeams,
    hideOpponentTeam,
    showOpponentTeam,
  } = useView();
  const navigate = useNavigate();
  const location = useLocation();

  // const handleSelectAllFantasyTeams = () => {
  //   if (!userTeams) return;
  //   showAllTeams();
  // };

  // const handleHideAllTeams = () => {
  //   if (!visibleOpponentTeams) return;
  //   hideAllTeams();
  // };

  const handleToggleLeagueSelected = (leagueId: string) => {
    if (leagueId === selectedLeagueId) {
      setSelectedLeagueId(null);
    } else {
      setSelectedLeagueId(leagueId);
    }
  };

  return (
    <div className={styles["fantasy-team-list-wrapper"]}>
      <h5>Your Leagues</h5>
      {userTeamsLoading ? (
        <p>Loading leagues...</p>
      ) : userTeamsError ? (
        <p>Error loading leagues: {(userTeamsError as Error).message}</p>
      ) : Object.keys(userTeams).length < 1 ? (
        <div className={styles["fantasy-team-basic-list"]}>
          <p>No leagues found</p>
        </div>
      ) : (
        <div className={styles["fantasy-team-list-container"]}>
          <Stack gap={0.5} align="center">
            <small className="muted">Click league to change visibility</small>
            {/* <div className={styles["fantasy-team-actions"]}>
              <LinkButton onClick={handleHideAllTeams}>Hide All</LinkButton>
              <LinkButton onClick={handleSelectAllFantasyTeams}>
                Show All
              </LinkButton>
            </div> */}
            <div className={styles["fantasy-team-list"]}>
              {Object.values(userTeams[CURRENT_SEASON.toString()]).map(
                (team) => {
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
                      selected={selectedLeagueId === team.leagueId}
                      handleToggleLeagueSelected={() =>
                        handleToggleLeagueSelected(team.leagueId)
                      }
                    />
                  );
                }
              )}
            </div>
          </Stack>
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
      )}
    </div>
  );
};

export default FantasyTeamOptions;
