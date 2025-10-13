import { LeagueCardData } from "../useLeagueCards";
import { Stack } from "../../../components/ui/Stack";
import styles from "./LeagueCardWeekRemaining.module.css";

export const LeagueCardWeekRemaining = ({ data }: { data: LeagueCardData }) => {
  const { team, opponent } = data;
  const { playerData, weekPoints } = team;
  const { weekPoints: opponentWeekPoints } = opponent ?? {};

  const playerRemainingTeam = playerData.filter(
    (player) => player.playedStatus !== "completed"
  );

  const playerRemainingOpponent = opponent?.playerData.filter(
    (player) => player.playedStatus !== "completed"
  );

  return (
    <div className={styles.leagueCardWeekRemainingWrapper}>
      <Stack align="center" justify="center">
        <h3 className={styles.leagueName}>{team.leagueName}</h3>
        <p>{data.matchupStatus?.result}</p>
        <Stack direction="row" align="center" justify="center">
          <p>{data.matchupStatus?.pointsDifference?.toFixed(2)} deficit</p>
          <Stack>
            <p>{weekPoints}</p>
            <p>{opponentWeekPoints}</p>
          </Stack>
        </Stack>
        <p>
          {playerRemainingTeam.length} vs. {playerRemainingOpponent?.length}
          players
        </p>
        <p>{data.matchupStatus?.losingNeedsPerPlayer?.toFixed(2)} / player</p>
      </Stack>
    </div>
  );
};
