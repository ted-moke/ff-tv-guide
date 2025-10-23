import { useMemo, useState } from "react";
import { Stack } from "../../../components/ui/Stack";
import { PlayerInLeagueCard } from "./PlayerInLeagueCard";
import { RosterSlotType } from "../../nfl/nflTypes";
import { PlayedStatus, Player } from "../../../types/shared";
import { positionOrder } from "../../players/usePlayers";
import { FantasyTeam } from "../../teams/teamTypes";
import styles from "./LeagueCardDesktop.module.css";
import { LuCheck, LuClock, LuTv } from "react-icons/lu";
import { useView } from "../../view/ViewContext";
import LinkButton, { LinkButtonColor } from "../../../components/ui/LinkButton";
import { useIsTeamVisible } from "../../teams/useIsTeamVisible";

type PlayersBy = Record<RosterSlotType, Record<PlayedStatus, Player[]>>;

export const LeagueCardExpanded = ({
  team,
  opponent,
  includeScores = false,
}: {
  team: FantasyTeam;
  opponent: FantasyTeam | null;
  includeScores?: boolean;
}) => {
  const [completePlayersOpen, setCompletePlayersOpen] = useState(false);
  const { isMobile, hideTeam, showTeam, hideOpponentTeam, showOpponentTeam } =
    useView();
  const { isTeamVisible, isOpponentVisible } = useIsTeamVisible({
    teamId: team.leagueId,
    opponentId: opponent?.leagueId || "",
  });

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

  const isBestBall = useMemo(() => {
    // loop through players: im prgoress, cokmpleted, upcoming.  until you find one is a best ball slot type then return true, else false
    if (teamPlayersByStatus.bestBall.inProgress.length > 0) {
      return true;
    }
    if (teamPlayersByStatus.bestBall.completed.length > 0) {
      return true;
    }
    if (teamPlayersByStatus.bestBall.upcoming.length > 0) {
      return true;
    }
    return false;
  }, [teamPlayersByStatus]);

  const teamPlayersGroupToShowByDefault = isBestBall
    ? teamPlayersByStatus.bestBall
    : teamPlayersByStatus.start;
  const opponentPlayersGroupToShowByDefault = isBestBall
    ? opponentPlayersByStatus.bestBall
    : opponentPlayersByStatus.start;

  const handleHideTeam = () => {
    hideTeam(team.leagueId);
  };
  const handleShowTeam = () => {
    showTeam(team.leagueId);
  };
  const handleHideOpponent = () => {
    hideOpponentTeam(team.leagueId);
  };
  const handleShowOpponent = () => {
    showOpponentTeam(team.leagueId);
  };

  const teamHasInProgressPlayers = useMemo(() => {
    return teamPlayersGroupToShowByDefault.inProgress.length > 0;
  }, [teamPlayersGroupToShowByDefault]);

  const opponentHasInProgressPlayers = useMemo(() => {
    return opponentPlayersGroupToShowByDefault.inProgress.length > 0;
  }, [opponentPlayersGroupToShowByDefault]);

  const teamHasCompletedPlayers = useMemo(() => {
    return teamPlayersGroupToShowByDefault.completed.length > 0;
  }, [teamPlayersGroupToShowByDefault]);

  const opponentHasCompletedPlayers = useMemo(() => {
    return opponentPlayersGroupToShowByDefault.completed.length > 0;
  }, [opponentPlayersGroupToShowByDefault]);

  const hasInProgressPlayers = useMemo(() => {
    return teamHasInProgressPlayers || opponentHasInProgressPlayers;
  }, [teamHasInProgressPlayers, opponentHasInProgressPlayers]);

  const hasCompletedPlayers = useMemo(() => {
    return teamHasCompletedPlayers || opponentHasCompletedPlayers;
  }, [teamHasCompletedPlayers, opponentHasCompletedPlayers]);

  return (
    <Stack
      fullWidth
      className={`${styles.expandedContent} ${isMobile ? styles.mobile : ""}`}
    >
      <Stack
        fullWidth
        direction="row"
        align="center"
        justify="center"
        gap={0.5}
      >
        <LinkButton
          color={LinkButtonColor.MUTED}
          size="small"
          onClick={isTeamVisible ? handleHideTeam : handleShowTeam}
        >
          {isTeamVisible ? "Hide Team" : "Show Team"}
        </LinkButton>
        <LinkButton
          color={LinkButtonColor.MUTED}
          size="small"
          onClick={isOpponentVisible ? handleHideOpponent : handleShowOpponent}
        >
          {isOpponentVisible ? "Hide Opponent" : "Show Opponent"}
        </LinkButton>
        {(isTeamVisible || isOpponentVisible) && (
          <LinkButton
            color={LinkButtonColor.MUTED}
            size="small"
            onClick={() => {
              handleHideTeam();
              handleHideOpponent();
            }}
          >
            Hide All
          </LinkButton>
        )}
        {(!isTeamVisible || !isOpponentVisible) && (
          <LinkButton
            color={LinkButtonColor.MUTED}
            size="small"
            onClick={() => {
              handleShowTeam();
              handleShowOpponent();
            }}
          >
            Show All
          </LinkButton>
        )}
      </Stack>
      <Stack className={styles.expandedPlayers} align="center" gap={0.5}>
        <Stack
          direction="row"
          align="center"
          justify="space-between"
          fullWidth
          gap={isMobile ? 1 : 3}
          className={styles.expandedPlayersHeader}
        >
          <Stack align="center" justify="center" gap={0.25}>
            {includeScores && <p>{team.weekPoints?.toFixed(2)}</p>}
            <p>Your Team</p>
          </Stack>
          {hasInProgressPlayers && (
            <Stack direction="row" align="center" justify="center">
              <LuTv color="var(--primary-color)" size={20} />
              <h4 className="primary">In Progress</h4>
            </Stack>
          )}

          {opponent && (
            <Stack align="center" justify="center" gap={0.25}>
              {includeScores && <p>{opponent.weekPoints?.toFixed(2)}</p>}
              <p>Opponent</p>
            </Stack>
          )}
        </Stack>
        {hasInProgressPlayers && (
          <>
          <Stack
            direction="row"
            align="start"
            justify="center"
            gap={1}
            fullWidth
          >
            <Stack fullHeight justify="start" align="center" fullWidth>
              {teamPlayersGroupToShowByDefault.inProgress.length <= 0 && (
                <PlayerInLeagueCard player={null} />
              )}
              {teamPlayersGroupToShowByDefault.inProgress.map((player) => (
                <PlayerInLeagueCard key={player.name} player={player} />
              ))}
            </Stack>
            {opponent && (
              <Stack fullHeight justify="start" align="center" fullWidth>
                {opponentPlayersGroupToShowByDefault.inProgress.length <= 0 && (
                  <PlayerInLeagueCard player={null} />
                )}
                {opponentPlayersGroupToShowByDefault.inProgress.map(
                  (player) => (
                    <PlayerInLeagueCard key={player.name} player={player} />
                  )
                )}
              </Stack>
            )}
          </Stack>
        <hr className={styles.divider} />
        </>
        )}
        <Stack direction="row" align="center" justify="center">
          <LuClock size={20} color="var(--primary-color)" />
          <h4 className="muted">Upcoming</h4>
        </Stack>
        <Stack direction="row" align="start" justify="center" gap={1} fullWidth>
          <Stack fullHeight justify="start" align="center" fullWidth>
            {teamPlayersGroupToShowByDefault.upcoming.length <= 0 && (
              <PlayerInLeagueCard player={null} />
            )}
            {teamPlayersGroupToShowByDefault.upcoming.map((player) => (
              <PlayerInLeagueCard key={player.name} player={player} />
            ))}
          </Stack>
          {opponent && (
            <Stack fullHeight justify="start" align="center" fullWidth>
              {opponentPlayersGroupToShowByDefault.upcoming.length <= 0 && (
                <PlayerInLeagueCard player={null} />
              )}
              {opponentPlayersGroupToShowByDefault.upcoming.map((player) => (
                <PlayerInLeagueCard key={player.name} player={player} />
              ))}
            </Stack>
          )}
        </Stack>
        {hasCompletedPlayers && (
          <>
            <hr className={styles.divider} />
            <Stack direction="row" align="center" justify="center">
              <LuCheck size={20} color="var(--color-green)" />
              <h4 className="muted">Completed</h4>
            </Stack>
            {completePlayersOpen && (
              <Stack
                direction="row"
                align="start"
                justify="center"
                gap={1}
                fullWidth
              >
                <Stack fullHeight justify="start" align="center" fullWidth>
                  {teamPlayersGroupToShowByDefault.completed.length <= 0 && (
                    <PlayerInLeagueCard hasPlayed player={null} />
                  )}
                  {teamPlayersGroupToShowByDefault.completed.map((player) => (
                    <PlayerInLeagueCard
                      hasPlayed
                      key={player.name}
                      player={player}
                    />
                  ))}
                </Stack>
                {opponent && (
                  <Stack fullHeight justify="start" align="center" fullWidth>
                    {opponentPlayersGroupToShowByDefault.completed.length <=
                      0 && <PlayerInLeagueCard hasPlayed player={null} />}
                    {opponentPlayersGroupToShowByDefault.completed.map(
                      (player) => (
                        <PlayerInLeagueCard
                          hasPlayed
                          key={player.name}
                          player={player}
                        />
                      )
                    )}
                  </Stack>
                )}
              </Stack>
            )}
            <LinkButton
              onClick={() => setCompletePlayersOpen(!completePlayersOpen)}
              color={LinkButtonColor.MUTED}
              size="small"
            >
              {completePlayersOpen ? "Hide Completed" : "Show Completed"}
            </LinkButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};
