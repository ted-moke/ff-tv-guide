import { LeagueCardData } from "../useLeagueCards";
import { Stack } from "../../../components/ui/Stack";
import styles from "./LeagueCardWeekRemaining.module.css";
import { LuEyeOff, LuFlame } from "react-icons/lu";
import { LeagueCardExpanded } from "./LeagueCardExpanded";

export const LeagueCardWeekRemaining = ({
  data,
  selectedTeamId,
  onToggleExpansion,
  isMobile,
}: {
  data: LeagueCardData;
  selectedTeamId: string | null;
  onToggleExpansion: (teamId: string) => void;
  isMobile: boolean;
}) => {
  const { team, opponent } = data;
  const { playerData } = team;

  const playerRemainingTeam = playerData.filter(
    (player) =>
      (player.playedStatus === "inProgress" ||
        player.playedStatus === "upcoming") &&
      player.rosterSlotType !== "bench"
  );

  const playerRemainingOpponent = opponent?.playerData.filter(
    (player) =>
      (player.playedStatus === "inProgress" ||
        player.playedStatus === "upcoming") &&
      player.rosterSlotType !== "bench"
  );

  const isWinning =
    data.matchupStatus?.result === "Winning" ||
    data.matchupStatus?.result === "Win";
  const isLosing =
    data.matchupStatus?.result === "Losing" ||
    data.matchupStatus?.result === "Loss";
  const isComplete = data.matchupStatus?.complete;
  const isCloseGame = data.matchupStatus?.closeGame;

  return (
    <Stack fullWidth gap={0}>
      <button
        onClick={() => onToggleExpansion(team.id || "")}
        className={`${styles.leagueCardWeekRemainingButton} buttonReset ${
          !data.visibility.team && styles.teamHidden
        } ${data.isUpdating ? styles.updating : ""}`}
      >
        <div
          className={`${styles.leagueCardWeekRemainingWrapper} ${
            isWinning ? styles.winning : isLosing ? styles.losing : ""
          } ${isComplete ? styles.complete : ""} ${
            isCloseGame ? styles.closeGame : ""
          } ${selectedTeamId === team.id ? styles.selected : ""}`}
        >
          <Stack direction="row" align="center" justify="start" gap={0.1}>
            <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
            {data.matchupStatus?.closeGame ? (
              <LuFlame size={16} color="var(--primary-color)" />
            ) : null}
          </Stack>
          {opponent ? (
            <p className={styles.matchupStatusPointsDifference}>
              {data.matchupStatus?.pointsDifference &&
              data.matchupStatus?.pointsDifference > 0
                ? "+"
                : ""}
              {data.matchupStatus?.pointsDifference?.toFixed(2)}
            </p>
          ) : (
            <p className={styles.matchupStatusPointsDifference}>
              {data.team.weekPoints}
            </p>
          )}
          {!data.visibility.team ? (
            <Stack direction="row" align="center" justify="center">
              <LuEyeOff
                size={isMobile ? 18 : 24}
                color="var(--text-color-muted)"
              />
            </Stack>
          ) : isComplete ? (
            <p className={styles.matchupStatusResult}>
              {data.matchupStatus?.result}
            </p>
          ) : (
            <Stack direction="row" align="center" justify="center" gap={0.2}>
              <p className={styles.playerCount}>{playerRemainingTeam.length}</p>
              {opponent ? (
                <>
                  <small className="muted">vs</small>
                  <p className={styles.playerCountOpponent}>
                    {playerRemainingOpponent?.length}
                  </p>
                </>
              ) : (
                <small>rem</small>
              )}
            </Stack>
          )}
        </div>
      </button>
      {selectedTeamId === team.id && (
        <LeagueCardExpanded
          team={team}
          opponent={opponent}
          includeScores={true}
        />
      )}
    </Stack>
  );
};
