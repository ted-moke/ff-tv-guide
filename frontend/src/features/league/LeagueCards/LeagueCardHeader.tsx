import { Stack } from "../../../components/ui/Stack";
import { FantasyTeam } from "../../teams/teamTypes";
import styles from "./LeagueCardHeader.module.css";
import { LuCheck, LuClock, LuEyeOff, LuTv } from "react-icons/lu";

export const LeagueCardHeader = ({
  hasWeekStarted,
  isCollapsed,
  team,
  opponent,
  recordStr,
  winPctEval,
  winningEval,
  isHidden = false,
}: {
  hasWeekStarted: boolean;
  isCollapsed: boolean;
  team: FantasyTeam;
  opponent: FantasyTeam | null;
  recordStr: string;
  winPctEval: string;
  winningEval: string;
  isHidden?: boolean;
}) => {
  return (
    <div
      className={`${styles.leagueCardWrapper} ${
        isCollapsed ? styles.collapsed : ""
      } ${styles[winPctEval]} ${styles[winningEval]} ${
        isHidden ? styles.hidden : ""
      }`}
    >
      {hasWeekStarted ? (
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          className={`${styles.leagueCardContent} ${styles.leagueCardContentWeekStarted}`}
          gap={0.5}
        >
          <Stack align="center" gap={0.25}>
            <h3 className={styles.leagueName}>
              {isCollapsed ? team.shortLeagueName : team.leagueName}
            </h3>
            {isHidden ? (
              <Stack direction="row" justify="center">
                <LuEyeOff size={16} color="var(--text-color-muted)" />
              </Stack>
            ) : (
              <Stack direction="row" align="center" gap={1}>
                <h3 className={styles.leagueRecord}>{recordStr}</h3>
                {!isCollapsed && (
                  <p className={styles.leagueRecord}>
                    {team.stats.averagePointsFor?.toFixed(1) || "0.0"} avg
                  </p>
                )}
              </Stack>
            )}
          </Stack>

          <Stack
            className={styles.leagueCardCenter}
            align="center"
            justify="center"
            gap={0.25}
          >
            <Stack direction="row" align="center">
              <p className={styles.weekPoints}>
                {team.weekPoints?.toFixed(1) || "0.0"}
              </p>
            </Stack>
            {opponent && (
              <>
                <Stack direction="row" align="center">
                  <span className={styles.weekPointsSeparator}>vs</span>
                </Stack>
                <Stack direction="row" align="center">
                  <p className={styles.weekPointsAgainst}>
                    {team.weekPointsAgainst?.toFixed(1) || "0.0"}
                  </p>
                </Stack>
              </>
            )}
          </Stack>
          <Stack
            className={`${styles.leagueCardSide} ${styles.playerCountWrapper}`}
            direction="row"
            align="center"
            justify="center"
            fullHeight
          >
            <Stack
              align="center"
              justify="space-around"
              gap={0.25}
              fullHeight
              className={styles.statusCountCompleted}
            >
              <p>{team.stats.playerStatusCount?.completed}</p>
              <LuCheck color="var(--text-color-muted)" size={12} />
              {opponent && <p>{opponent.stats.playerStatusCount?.completed}</p>}
            </Stack>
            <Stack
              align="center"
              justify="space-around"
              gap={0.25}
              fullHeight
              className={`${styles.statusCountInProgress}`}
            >
              <p
                className={
                  team.stats.playerStatusCount &&
                  team.stats.playerStatusCount.inProgress > 0
                    ? styles.hasPlayers
                    : ""
                }
              >
                {team.stats.playerStatusCount?.inProgress}
              </p>
              <LuTv size={12} color="#a0a0a0" />
              {opponent && (
                <p
                  className={
                    opponent.stats.playerStatusCount &&
                    opponent.stats.playerStatusCount.inProgress > 0
                      ? styles.hasPlayers
                      : ""
                  }
                >
                  {opponent.stats.playerStatusCount?.inProgress}
                </p>
              )}
            </Stack>
            <Stack
              align="center"
              justify="space-around"
              gap={0.25}
              fullHeight
              className={styles.statusCountUpcoming}
            >
              <p>{team.stats.playerStatusCount?.upcoming}</p>
              <LuClock color="#a0a0a0" size={12} />
              {opponent && <p>{opponent.stats.playerStatusCount?.upcoming}</p>}
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <div
          className={`${styles.leagueCardContent} ${styles.leagueCardContentNoWeekStarted}`}
        >
          <div className={styles.leagueCardTop}>
            <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
            {isHidden ? (
              <Stack direction="row" justify="center">
                <LuEyeOff size={16} color="var(--text-color-muted)" />
              </Stack>
            ) : (
              <h3 className={styles.leagueRecord}>{recordStr}</h3>
            )}
          </div>
          <div className={styles.leagueCardBottom}>
            <p className={styles.avgPointsLabel}>Avg</p>
            <p className={styles.avgPoints}>
              {team.stats.averagePointsFor?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
