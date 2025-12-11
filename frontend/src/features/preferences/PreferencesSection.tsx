import { useMemo } from "react";
import { useView } from "../view/ViewContext";
import { Stack } from "../../components/ui/Stack";
import LinkButton, { LinkButtonColor } from "../../components/ui/LinkButton";
import { CURRENT_SEASON } from "../../constants";
import styles from "./PreferencesSection.module.css";
import IconButton from "../../components/IconButton";
import { LuX, LuEyeOff } from "react-icons/lu";

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
      <div className={styles.teamsList}>
        {allTeams.map((team) => {
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
          const showHiddenIcon = allHidden || oppHidden;

          return (
            <div key={team.leagueId} className={styles.teamRow}>
              <div className={styles.teamHeader}>
                {showHiddenIcon && (
                    <div className={styles.status}>
                    <LuEyeOff size={16} color="var(--text-color-muted)" />
                    {oppHidden && (
                        <span className={styles.statusText}>(hidden opponent)</span>
                    )}
                  </div>
                )}
                <div className={`${styles.teamName} ${allHidden ? styles.hidden : ""}`}>{team.leagueName}</div>
              </div>
              <Stack
                direction="row"
                gap={0.5}
                align="center"
                className={styles.controls}
              >
                {allHidden ? (
                  <>
                    <LinkButton
                      color={LinkButtonColor.MUTED}
                      size="small"
                      onClick={() => {
                        showTeam(team.leagueId);
                        if (hasOpponent) {
                          showOpponentTeam(team.leagueId);
                        }
                      }}
                    >
                      Show All
                    </LinkButton>
                    <LinkButton
                      color={LinkButtonColor.MUTED}
                      size="small"
                      onClick={() => showTeam(team.leagueId)}
                    >
                      Show Team
                    </LinkButton>
                  </>
                ) : (
                  <>
                    <LinkButton
                      color={LinkButtonColor.MUTED}
                      size="small"
                      onClick={() => {
                        hideTeam(team.leagueId);
                        if (hasOpponent) {
                          hideOpponentTeam(team.leagueId);
                        }
                      }}
                    >
                      Hide All
                    </LinkButton>
                    {hasOpponent && (
                      <LinkButton
                        color={LinkButtonColor.MUTED}
                        size="small"
                        onClick={() => {
                          if (isOpponentVisible) {
                            hideOpponentTeam(team.leagueId);
                          } else {
                            showOpponentTeam(team.leagueId);
                          }
                        }}
                      >
                        {isOpponentVisible ? "Hide Opponent" : "Show Opponent"}
                      </LinkButton>
                    )}
                  </>
                )}
              </Stack>
            </div>
          );
        })}
      </div>
    </div>
  );
};
