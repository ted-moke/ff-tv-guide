import { FaFootball } from "react-icons/fa6";
import { Stack } from "../../../components/ui/Stack";
import { FantasyTeam } from "../../teams/teamTypes";
import styles from "./LeagueCardMobileHeader.module.css";
import { LuCheckCheck, LuClock } from "react-icons/lu";

export const LeagueCardMobileHeader = ({
  hasWeekStarted,
  isCollapsed,
  team,
  recordStr,
  winPctEval,
  winningEval,
}: {
  hasWeekStarted: boolean;
  isCollapsed: boolean;
  team: FantasyTeam;
  recordStr: string;
  winPctEval: string;
  winningEval: string;
}) => {
  return (
    <div
      className={`${styles.leagueCardWrapper} ${
        isCollapsed ? styles.collapsed : ""
      } ${styles[winPctEval]} ${styles[winningEval]}`}
    >
      {hasWeekStarted ? (
        <Stack
          direction="row"
          justify="between"
          className={`${styles.leagueCardContent} ${styles.leagueCardContentWeekStarted}`}
        >
          <Stack
            className={styles.leagueCardLeft}
            direction="row"
            align="center"
            justify="center"
          >
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.completed}</p>
              <FaFootball size={12} />
            </Stack>
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.inProgress}</p>
              <LuClock size={12} />
            </Stack>
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.upcoming}</p>
              <LuCheckCheck size={12} />
            </Stack>
          </Stack>

          <Stack
            className={styles.leagueCardCenter}
            align="baseline"
            justify="center"
          >
            <Stack direction="row" align="center">
              <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
              <h3 className={styles.leagueRecord}>{recordStr}</h3>
            </Stack>
            <Stack direction="row" align="center">
              <p className={styles.weekPoints}>
                {team.weekPoints?.toFixed(1) || "0.0"}
              </p>
              <span className={styles.weekPointsSeparator}>v</span>
              <p className={styles.weekPointsAgainst}>
                {team.weekPointsAgainst?.toFixed(1) || "0.0"}
              </p>
            </Stack>
          </Stack>

          <Stack
            className={styles.leagueCardBottomLeft}
            direction="row"
            align="center"
            justify="center"
          >
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.completed}</p>
              <FaFootball size={12} />
            </Stack>
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.inProgress}</p>
              <LuClock size={12} />
            </Stack>
            <Stack align="center" justify="center" gap={0.25}>
              <p>{team.stats.playerStatusCount?.upcoming}</p>
              <LuCheckCheck size={12} />
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <div
          className={`${styles.leagueCardContent} ${styles.leagueCardContentNoWeekStarted}`}
        >
          <div className={styles.leagueCardTop}>
            <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
            <h3 className={styles.leagueRecord}>{recordStr}</h3>
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
