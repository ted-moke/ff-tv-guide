import { useMemo } from "react";
import { useView } from "../view/ViewContext";
import { Stack } from "../../components/ui/Stack";
import { CURRENT_SEASON } from "../../constants";
import styles from "./PreferencesSection.module.css";
import IconButton from "../../components/IconButton";
import { LuX, LuEyeOff, LuEye } from "react-icons/lu";
import Button from "../../components/ui/Button";

export const PreferencesSection = () => {
  const {
    userTeams,
    opponentTeams,
    visibleTeams,
    visibleOpponentTeams,
    hideTeam,
    showTeam,
    hideOpponentTeam,
    showOpponentTeam,
    setIsPreferencesOpen,
  } = useView();

  // Flatten userTeams to get all teams for current season
  const allTeams = useMemo(() => {
    const currentSeasonTeams = userTeams[CURRENT_SEASON] || {};
    const currentSeasonTeamsArray = Object.values(currentSeasonTeams);
    currentSeasonTeamsArray.sort((a, b) => {
      if (!a.opponentId && b.opponentId) {
        return 1;
      } else if (a.opponentId && !b.opponentId) {
        return -1;
      } else {
        return a.leagueName.localeCompare(b.leagueName);
      }
    });
    return currentSeasonTeamsArray;
  }, [userTeams]);

  // Create a map of leagueMasterId to opponent for quick lookup
  const opponentMap = useMemo(() => {
    const map = new Map<string, (typeof opponentTeams)[0]>();
    opponentTeams.forEach((opponent) => {
      map.set(opponent.leagueMasterId, opponent);
    });
    return map;
  }, [opponentTeams]);

  return (
    <div className={styles.preferencesSection}>
      <Stack direction="row" align="center" justify="space-between">
        <h4>Preferences</h4>
        <IconButton
          icon={<LuX size={20} color="var(--text-color-muted)" />}
          onClick={() => {
            setIsPreferencesOpen(false);
          }}
        />
      </Stack>
      <small className="muted">
        Click the eye icon to change which players are shown in the app.
      </small>
      <div className={styles.teamsList}>
        {allTeams.map((team) => {
          console.log(team);
          const opponent = opponentMap.get(team.leagueMasterId);
          const isTeamVisible = visibleTeams.some(
            (t) => t.leagueId === team.leagueId
          );
          const isOpponentVisible = opponent
            ? visibleOpponentTeams.some((t) => t.leagueId === opponent.leagueId)
            : false;

          const allHidden = !isTeamVisible && !isOpponentVisible;
          const hasOpponent = !!opponent;
          const oppHidden = hasOpponent && !isOpponentVisible && isTeamVisible;
          const allVisible =
            isTeamVisible && (!hasOpponent || isOpponentVisible);

          const handleEyeClick = () => {
            if (allVisible) {
              // All visible -> All hidden
              hideTeam(team.leagueId);
              if (hasOpponent) {
                hideOpponentTeam(team.leagueId);
              }
            } else if (allHidden) {
              // All hidden -> Hide opponent only (if has opponent) or All visible
              if (hasOpponent) {
                showTeam(team.leagueId);
                // Opponent stays hidden
              } else {
                showTeam(team.leagueId);
              }
            } else if (oppHidden) {
              // Hide opponent only -> All visible
              showOpponentTeam(team.leagueId);
            }
          };

          return (
            <div key={team.leagueId} className={styles.teamRow}>
              <div className={styles.teamHeader}>
                <div
                  className={styles.eyeIcon}
                  onClick={handleEyeClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEyeClick();
                    }
                  }}
                >
                  {allVisible ? (
                    <LuEye size={16} color="var(--text-color-muted)" />
                  ) : allHidden ? (
                    <LuEyeOff size={16} color="var(--text-color-muted)" />
                  ) : (
                    <Stack direction="row" align="center" gap={0.5}>
                      <LuEyeOff size={16} color="var(--text-color-muted)" />
                      <span className={styles.statusText}>
                        (hidden opponent)
                      </span>
                    </Stack>
                  )}
                </div>
                <div
                  className={`${styles.teamName} ${
                    allHidden ? styles.hidden : ""
                  }`}
                >
                  {team.leagueName}
                </div>
              </div>
            </div>
          );
        })}
        <Button onClick={() => {
          setIsPreferencesOpen(false);
        }}>
          Done
        </Button>
      </div>
    </div>
  );
};
