import { LeagueCardData } from "../useLeagueCards";
import { Stack } from "../../../components/ui/Stack";
import styles from "./LeagueCardWeekRemaining.module.css";
import { LuFlame } from "react-icons/lu";
import { LeagueCardExpanded } from "./LeagueCardExpanded";

export const LeagueCardWeekRemaining = ({
  data,
  selectedTeamId,
  onToggleExpansion,
}: {
  data: LeagueCardData;
  selectedTeamId: string | null;
  onToggleExpansion: (teamId: string) => void;
}) => {
  const { team, opponent } = data;
  const { playerData } = team;

  const playerRemainingTeam = playerData.filter(
    (player) =>
      player.playedStatus !== "completed" && player.rosterSlotType !== "bench"
  );

  const playerRemainingOpponent = opponent?.playerData.filter(
    (player) =>
      player.playedStatus !== "completed" && player.rosterSlotType !== "bench"
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
    <button
      onClick={() => onToggleExpansion(team.id || "")}
      className="buttonReset"
    >
      <div
        className={`${styles.leagueCardWeekRemainingWrapper} ${
          isWinning ? styles.winning : isLosing ? styles.losing : ""
        } ${isComplete ? styles.complete : ""} ${
          isCloseGame ? styles.closeGame : ""
        }`}
      >
        <Stack direction="row" align="center" justify="start" gap={0.25}>
          <h3 className={styles.leagueName}>{team.shortLeagueName}</h3>
          {data.matchupStatus?.closeGame ? (
            <LuFlame size={16} color="var(--primary-color)" />
          ) : null}
        </Stack>

        <Stack direction="row" align="center" justify="center">
          <p className={styles.matchupStatusPointsDifference}>
            {data.matchupStatus?.pointsDifference &&
            data.matchupStatus?.pointsDifference > 0
              ? "+"
              : ""}
            {data.matchupStatus?.pointsDifference?.toFixed(2)}
          </p>
        </Stack>
        {isComplete ? (
          <p className={styles.matchupStatusResult}>
            {data.matchupStatus?.result}
          </p>
        ) : null}
        {!isComplete && (
          <Stack direction="row" align="center" justify="center" gap={0.2}>
            <p className={styles.playerCount}>{playerRemainingTeam.length}</p>
            <small className="muted">vs</small>
            <p className={styles.playerCountOpponent}>
              {playerRemainingOpponent?.length}
            </p>
          </Stack>
        )}
      </div>
      {selectedTeamId === team.id && (
        <LeagueCardExpanded
          team={team}
          opponent={opponent}
          includeScores={true}
        />
      )}
    </button>
  );
};
