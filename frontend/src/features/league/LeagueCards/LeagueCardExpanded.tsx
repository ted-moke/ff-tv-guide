import { useMemo } from "react";
import { Stack } from "../../../components/ui/Stack";
import { PlayerInLeagueCard } from "./PlayerInLeagueCard";
import { RosterSlotType } from "../../nfl/nflTypes";
import { PlayedStatus, Player } from "../../../types/shared";
import { positionOrder } from "../../players/usePlayers";
import { FantasyTeam } from "../../teams/teamTypes";
import styles from "./LeagueCardDesktop.module.css";
import { LuCheck, LuClock, LuTv } from "react-icons/lu";

type PlayersBy = Record<RosterSlotType, Record<PlayedStatus, Player[]>>;

export const LeagueCardExpanded = ({
  team,
  opponent,
  isMobile = false,
}: {
  team: FantasyTeam;
  opponent: FantasyTeam | null;
  isMobile: boolean;
}) => {
  console.log('team', team);
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
    <div className={`${styles.expandedContent} ${isMobile ? styles.mobile : ""}`}>
      <Stack className={styles.expandedPlayers} align="center" gap={0.5}>
        <Stack
          direction="row"
          align="center"
          justify={isMobile ? "space-around" : "center"}
          fullWidth
          gap={isMobile ? 1 : 3}
          className={styles.expandedPlayersHeader}
        >
          <p className="muted">Your Team</p>
          <Stack direction="row" align="center" justify="center">
            <LuTv color="var(--primary-color)" size={20} />
            <h4 className="primary">In Progress</h4>
          </Stack>
          {opponent && <p className="muted">Opponent Team</p>}
        </Stack>
        <Stack direction="row" align="start" justify="center" gap={2} fullWidth>
          <Stack fullHeight justify="start" fullWidth>
            {teamPlayersGroupToShowByDefault.inProgress.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.inProgress.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start" fullWidth>
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
        <Stack direction="row" align="center" justify="center">
            <LuClock size={20} />
            <h4>Upcoming</h4>
          </Stack>
        <Stack direction="row" align="start" justify="center" gap={2} fullWidth>
          <Stack fullHeight justify="start" fullWidth>
            {teamPlayersGroupToShowByDefault.upcoming.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.upcoming.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start" fullWidth>
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
        <Stack direction="row" align="center" justify="center">
            <LuCheck size={20} />
            <h4>Completed</h4>
          </Stack>
        <Stack direction="row" align="start" justify="center" gap={2} fullWidth>
          <Stack fullHeight justify="start" fullWidth>
            {teamPlayersGroupToShowByDefault.completed.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.completed.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start" fullWidth>
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
