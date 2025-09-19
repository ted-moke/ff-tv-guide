import { useMemo } from "react";
import { Stack } from "../../../components/ui/Stack";
import { PlayerInLeagueCard } from "./PlayerInLeagueCard";
import { RosterSlotType } from "../../nfl/nflTypes";
import { PlayedStatus, Player } from "../../../types/shared";
import { positionOrder } from "../../players/usePlayers";
import { FantasyTeam } from "../../teams/teamTypes";
import styles from "./LeagueCardDesktop.module.css";
import { LuTv } from "react-icons/lu";

type PlayersBy = Record<RosterSlotType, Record<PlayedStatus, Player[]>>;

export const LeagueCardExpanded = ({
  team,
  opponent,
}: {
  team: FantasyTeam;
  opponent: FantasyTeam | null;
}) => {
  const { teamPlayersByStatus, opponentPlayersByStatus } = useMemo(() => {
    const playersBy: PlayersBy = {
      start: { completed: [], inProgress: [], upcoming: [], unknown: [] },
      bench: { completed: [], inProgress: [], upcoming: [], unknown: [] },
      bestBall: { completed: [], inProgress: [], upcoming: [], unknown: [] },
    };

    const opponentPlayersBy: PlayersBy = {
      start: { completed: [], inProgress: [], upcoming: [], unknown: [] },
      bench: { completed: [], inProgress: [], upcoming: [], unknown: [] },
      bestBall: { completed: [], inProgress: [], upcoming: [], unknown: [] },
    };

    team.playerData.forEach((player) => {
      playersBy[player.rosterSlotType][player.playedStatus].push(player);
    });

    Object.keys(playersBy).forEach((rosterSlotType) => {
      Object.keys(playersBy[rosterSlotType as RosterSlotType]).forEach(
        (playedStatus) => {
          playersBy[rosterSlotType as RosterSlotType][
            playedStatus as PlayedStatus
          ].sort(
            (a, b) =>
              positionOrder.indexOf(a.position) -
              positionOrder.indexOf(b.position)
          );
        }
      );
    });

    if (opponent) {
      opponent.playerData.forEach((player) => {
        opponentPlayersBy[player.rosterSlotType][player.playedStatus].push(
          player
        );
      });

      Object.keys(opponentPlayersBy).forEach((rosterSlotType) => {
        Object.keys(
          opponentPlayersBy[rosterSlotType as RosterSlotType]
        ).forEach((playedStatus) => {
          opponentPlayersBy[rosterSlotType as RosterSlotType][
            playedStatus as PlayedStatus
          ].sort(
            (a, b) =>
              positionOrder.indexOf(a.position) -
              positionOrder.indexOf(b.position)
          );
        });
      });
    }

    return {
      teamPlayersByStatus: playersBy,
      opponentPlayersByStatus: opponentPlayersBy,
    };
  }, [team.playerData]);

  const isBestBall = teamPlayersByStatus.bestBall.inProgress.length > 0;

  const teamPlayersGroupToShowByDefault = isBestBall
    ? teamPlayersByStatus.bestBall
    : teamPlayersByStatus.start;
  const opponentPlayersGroupToShowByDefault = isBestBall
    ? opponentPlayersByStatus.bestBall
    : opponentPlayersByStatus.start;

  return (
    <div className={styles.expandedContent}>
      <Stack className={styles.expandedPlayers} align="center" gap={0.5}>
        <Stack
          direction="row"
          align="center"
          justify="center"
          fullWidth
          gap={3}
        >
          <p className="muted">Your Team</p>
          <Stack direction="row" align="center" justify="center">
            <LuTv color="var(--primary-color)" size={20} />
            <h4 className="primary">In Progress</h4>
          </Stack>
          {opponent && <p className="muted">Opponent Team</p>}
        </Stack>
        <Stack direction="row" align="center" justify="center" gap={2}>
          <Stack fullHeight justify="start">
            {teamPlayersGroupToShowByDefault.inProgress.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.inProgress.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start">
              {opponentPlayersGroupToShowByDefault.inProgress.length <= 0 && (
                <PlayerInLeagueCard player={null} />
              )}
              {opponentPlayersGroupToShowByDefault.inProgress.map((player) => (
                <PlayerInLeagueCard key={player.name} player={player} />
              ))}
            </Stack>
          )}
        </Stack>
        <hr className={styles.divider} />
        <h4>Upcoming</h4>
        <Stack direction="row" align="center" justify="center" gap={2}>
          <Stack fullHeight justify="start">
            {teamPlayersGroupToShowByDefault.upcoming.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.upcoming.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start">
              {opponentPlayersGroupToShowByDefault.upcoming.length <= 0 && (
                <PlayerInLeagueCard player={null} />
              )}
              {opponentPlayersGroupToShowByDefault.upcoming.map((player) => (
                <PlayerInLeagueCard key={player.name} player={player} />
              ))}
            </Stack>
          )}
        </Stack>
        <hr className={styles.divider} />
        <h4>Completed</h4>
        <Stack direction="row" align="center" justify="center" gap={2}>
          <Stack fullHeight justify="start">
            {teamPlayersGroupToShowByDefault.completed.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.completed.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start">
              {opponentPlayersGroupToShowByDefault.completed.length <= 0 && (
                <PlayerInLeagueCard player={null} />
              )}
              {opponentPlayersGroupToShowByDefault.completed.map((player) => (
                <PlayerInLeagueCard key={player.name} player={player} />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* 
        <div className={styles.leagueActions}>
          <button className={styles.actionButton}>
            View Details
          </button>
          <button className={styles.actionButton}>
            League Settings
          </button>
        </div> */}
    </div>
  );
};
