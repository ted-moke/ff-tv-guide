import React, { useMemo, useState } from "react";
import styles from "./LeagueCardDesktop.module.css";
import { LeagueCardData } from "../useLeagueCards";
import { LeagueCardHeader } from "./LeagueCardHeader";
import { PlayedStatus, Player } from "../../../types/shared";
import { positionOrder } from "../../players/usePlayers";
import { RosterSlotType } from "../../nfl/nflTypes";
import { PlayerInLeagueCard } from "./PlayerInLeagueCard";
import { Stack } from "../../../components/ui/Stack";
import { LuTv } from "react-icons/lu";

interface LeagueCardDesktopProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
  selectedTeamId: string | null;
}

type PlayersBy = Record<RosterSlotType, Record<PlayedStatus, Player[]>>;

export const LeagueCardDesktop: React.FC<LeagueCardDesktopProps> = ({
  cardData,
  onToggleExpansion,
  hasWeekStarted,
  selectedTeamId,
}) => {
  const [isBenchExpanded, setIsBenchExpanded] = useState(false);
  const { team, winning, losing } = cardData;

  const handleCardClick = () => {
    onToggleExpansion(team.id || "");
  };

  const wins = team.stats.wins || 0;
  const losses = team.stats.losses || 0;
  const ties = team.stats.ties || 0;
  const totalGames = wins + losses + ties;
  const averagePointsFor = team.stats.averagePointsFor || 0;
  const opponent = cardData.opponent;

  const winPercentage = totalGames > 0 ? wins / totalGames : 0;
  const recordStr = `${wins}-${losses}${ties ? `-${ties}` : ""}`;
  const winPctEval =
    winPercentage > 0.5
      ? "winPercentageGood"
      : winPercentage < 0.5
      ? "winPercentageBad"
      : "winPercentageNeutral";

  const winningEval = winning ? "winning" : losing ? "losing" : "tied";

  const isSelected = selectedTeamId === team.id;
  const otherSelected = selectedTeamId !== team.id && selectedTeamId !== null;

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
    <div
      className={`${styles.leagueCard} ${isSelected ? styles.expanded : ""} ${
        otherSelected ? styles.otherSelected : ""
      } ${winning ? styles.winning : losing ? styles.losing : styles.tied} ${
        winPercentage > 0.5
          ? styles.winPercentageGood
          : winPercentage < 0.5
          ? styles.winPercentageBad
          : styles.winPercentageNeutral
      }`}
      id={`league-${team.id}`}
    >
      <div
        className={styles.leagueCardHeader}
        role="button"
        onClick={handleCardClick}
        aria-expanded={isSelected}
      >
        <LeagueCardHeader
          hasWeekStarted={hasWeekStarted}
          isCollapsed={isSelected}
          team={team}
          opponent={opponent}
          recordStr={recordStr}
          winPctEval={winPctEval}
          winningEval={winningEval}
        />
      </div>
      {isSelected && (
        <>
          <hr className={styles.divider} />
          <div className={styles.expandedContent}>
            {/* <div className={styles.expandedStats}>
              <div className={`${styles.statItem} ${styles.recordItem}`}>
                <span className={styles.statLabel}>Record</span>
                <span className={styles.statValue}>
                  {wins}-{losses}
                  {ties ? `-${ties}` : ""}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Pts</span>
                <span className={styles.statValue}>
                  {averagePointsFor?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div> */}
            <Stack className={styles.expandedPlayers} align="center" gap={0.5}>
              <Stack
                direction="row"
                align="center"
                justify="center"
                fullWidth
                gap={3}
              >
                <p className={styles.muted}>Your Team</p>
                <Stack direction="row" align="center" justify="center">
                  <LuTv color="var(--primary-color)" size={20} />
                  <h4 className={styles.primary}>In Progress</h4>
                </Stack>
                {opponent && <p className={styles.muted}>Opponent Team</p>}
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
                    {opponentPlayersGroupToShowByDefault.inProgress.length <=
                      0 && (
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
                    {opponentPlayersGroupToShowByDefault.upcoming.map(
                      (player) => (
                        <PlayerInLeagueCard key={player.name} player={player} />
                      )
                    )}
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
                    {opponentPlayersGroupToShowByDefault.completed.map(
                      (player) => (
                        <PlayerInLeagueCard key={player.name} player={player} />
                      )
                    )}
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
        </>
      )}
    </div>
  );
};
