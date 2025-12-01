import { useState, useMemo } from "react";
import { useView } from "../view/ViewContext";
import { FantasyTeam } from "../teams/teamTypes";
import { Player } from "../../types";
import { CURRENT_SEASON } from "../../constants";

interface MatchupStatus {
  result: string;
  complete: boolean;
  closeGame: boolean;
  pointsDifference: number;
  losingNeedsPerPlayer: number | null;
}

export interface LeagueCardData {
  team: FantasyTeam;
  winning: boolean;
  losing: boolean;
  tied: boolean;
  opponent: FantasyTeam | null;
  matchupStatus: MatchupStatus | null;
  visibility: {
    team: boolean;
    opponent: boolean;
  };
}

const getResultVsOpponent = ({
  weekPoints,
  opponentWeekPoints,
  opponentRemainingPlayers,
  remainingPlayers,
}: {
  weekPoints: number;
  opponentWeekPoints: number;
  opponentRemainingPlayers: Player[];
  remainingPlayers: Player[];
}): MatchupStatus => {
  const pointDifference = weekPoints - opponentWeekPoints;
  const isWinning = pointDifference > 0;
  const remainingNum = remainingPlayers.length;
  const opponentRemainingNum = opponentRemainingPlayers.length;

  const avgPlayerScore = 13;
  const closeGamePerPlayer = 3; // per player, i.e. if the game is close, then the losing team needs 1.75 points per player to win

  if (isWinning && opponentRemainingNum === 0) {
    return {
      result: "Win",
      complete: true,
      closeGame: false, // TODO: Still want to make a way to display a game thats over was close
      pointsDifference: pointDifference,
      losingNeedsPerPlayer: null,
    };
  } else if (!isWinning && remainingNum === 0) {
    return {
      result: "Loss",
      complete: true,
      closeGame: false,
      pointsDifference: pointDifference,
      losingNeedsPerPlayer: null,
    };
  } else if (
    pointDifference === 0 &&
    remainingNum === 0 &&
    opponentRemainingNum === 0
  ) {
    return {
      result: "Tie",
      complete: true,
      closeGame: false,
      pointsDifference: pointDifference,
      losingNeedsPerPlayer: null,
    };
  }

  //   const hasMoreRemaining = remainingDifference > 0;
  //   const hasEqualRemaining = remainingDifference === 0;

  let amountPerPlayerLosingTeamNeeds = (() => {
    if (isWinning) {
      if (remainingNum === 0) {
        return Math.abs(pointDifference / opponentRemainingNum);
      }
      const adjustedDifference =
        pointDifference + avgPlayerScore * remainingNum;
      const losingNeedsPerPlayer = Math.abs(
        adjustedDifference / opponentRemainingNum
      );

      return losingNeedsPerPlayer;
    } else {
      if (opponentRemainingNum === 0) {
        return Math.abs(pointDifference / remainingNum);
      }

      const adjustedDifference =
        pointDifference - avgPlayerScore * opponentRemainingNum;
      const losingNeedsPerPlayer = Math.abs(adjustedDifference / remainingNum);

      return losingNeedsPerPlayer;
    }
  })();

  if (amountPerPlayerLosingTeamNeeds / avgPlayerScore > closeGamePerPlayer) {
    if (isWinning) {
      return {
        result: "Winning",
        complete: false,
        closeGame: false,
        pointsDifference: pointDifference,
        losingNeedsPerPlayer: amountPerPlayerLosingTeamNeeds,
      };
    } else {
      return {
        result: "Losing",
        complete: false,
        closeGame: false,
        pointsDifference: pointDifference,
        losingNeedsPerPlayer: amountPerPlayerLosingTeamNeeds,
      };
    }
  }

  if (isWinning) {
    return {
      result: "Winning",
      complete: false,
      closeGame: true,
      pointsDifference: pointDifference,
      losingNeedsPerPlayer: amountPerPlayerLosingTeamNeeds,
    };
  }

  return {
    result: "Losing",
    complete: false,
    closeGame: true,
    pointsDifference: pointDifference,
    losingNeedsPerPlayer: amountPerPlayerLosingTeamNeeds,
  };
};

export const useLeagueCards = () => {
  const {
    userTeams,
    visibleTeams,
    visibleOpponentTeams,
    matchupPlayers,
    thruSundayDayGames,
  } = useView();
  const [selectedTeamId, setselectedTeamId] = useState<string | null>(null);

  const currentSeasonTeams = useMemo(() => {
    return userTeams[CURRENT_SEASON];
  }, [userTeams]);

  const leagueCardsData = useMemo((): LeagueCardData[] => {
    if (!matchupPlayers) {
      return [];
    }

    const cardData = Object.values(currentSeasonTeams).map((team) => {
      const winning =
        team.weekPoints != null &&
        team.weekPointsAgainst != null &&
        team.weekPoints > team.weekPointsAgainst;
      const losing =
        team.weekPoints != null &&
        team.weekPointsAgainst != null &&
        team.weekPoints < team.weekPointsAgainst;
      const tied = !winning && !losing;

      const opponent =
        visibleOpponentTeams.find(
          (opponent) => opponent.leagueMasterId === team.leagueMasterId
        ) || null;

      const isTeamVisible = visibleTeams.some((t) => t.leagueId === team.leagueId);

      console.log('isTeamVisible', isTeamVisible, team.leagueId, visibleTeams);

      return {
        team,
        winning,
        losing,
        tied,
        opponent,
        visibility: {
          team: isTeamVisible,
          opponent: !!opponent,
        },
      };
    });

    const cardDataWithMatchupStatus = cardData.map((data) => {
      if (
        !data.team.weekPoints ||
        !data.opponent?.weekPoints ||
        !data.opponent?.playerData ||
        !data.team.playerData
      ) {
        return {
          ...data,
          matchupStatus: null,
        };
      }

      const matchupStatus = getResultVsOpponent({
        weekPoints: data.team.weekPoints,
        opponentWeekPoints: data.opponent?.weekPoints,
        opponentRemainingPlayers: data.opponent?.playerData.filter(
          (player) =>
            (player.playedStatus === "inProgress" ||
              player.playedStatus === "upcoming") &&
            player.rosterSlotType !== "bench"
        ),
        remainingPlayers: data.team.playerData.filter(
          (player) =>
            (player.playedStatus === "inProgress" ||
              player.playedStatus === "upcoming") &&
            player.rosterSlotType !== "bench"
        ),
      });
      return {
        ...data,
        matchupStatus,
      };
    });

    if (thruSundayDayGames) {
      return cardDataWithMatchupStatus.sort((a, b) => {
        // Sort so hidden teams are at the bottom 
        if (!a.visibility.team && b.visibility.team) {
          return 1;
        }
        if (a.visibility.team && !b.visibility.team) {
          return -1;
        }

        // Sort so completed games are at the bottom
        if (a.matchupStatus?.complete && !b.matchupStatus?.complete) {
          return 1;
        }

        // Sort so incomplete games are the next highest
        if (!a.matchupStatus?.complete && b.matchupStatus?.complete) {
          return -1;
        }

        // Sort so games where we're hiding the opponent are the next highest
        if (
          !a.matchupStatus?.pointsDifference ||
          !b.matchupStatus?.pointsDifference
        ) {
          return 0;
        }

        // Sort so games with less points difference are the next highest
        if (
          Math.abs(a.matchupStatus?.pointsDifference) <
          Math.abs(b.matchupStatus?.pointsDifference)
        ) {
          return -1;
        }
        return 1;
      });
    }

    return cardDataWithMatchupStatus.sort((a, b) => {
      if (a.team.stats.winPercentage && b.team.stats.winPercentage) {
        return b.team.stats.winPercentage - a.team.stats.winPercentage;
      }
      return 0;
    });
  }, [currentSeasonTeams, selectedTeamId, visibleOpponentTeams]);

  const toggleCardExpansion = (teamId: string) => {
    setselectedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  const portfolioData = useMemo(() => {
    return leagueCardsData.reduce(
      (acc, data) => {
        if (data.matchupStatus?.complete) {
          acc.wins += data.matchupStatus?.result === "Win" ? 1 : 0;
          acc.losses += data.matchupStatus?.result === "Loss" ? 1 : 0;
          acc.ties += data.matchupStatus?.result === "Tie" ? 1 : 0;
        } else {
          acc.trendingWins += data.matchupStatus?.result === "Winning" ? 1 : 0;
          acc.trendingLosses += data.matchupStatus?.result === "Losing" ? 1 : 0;
          acc.trendingTies += data.matchupStatus?.result === "Tie" ? 1 : 0;
        }

        return acc;
      },
      {
        wins: 0,
        losses: 0,
        ties: 0,
        trendingWins: 0,
        trendingLosses: 0,
        trendingTies: 0,
      }
    );
  }, [leagueCardsData]);

  return {
    leagueCardsData,
    toggleCardExpansion,
    selectedTeamId,
    portfolioData,
  };
};
