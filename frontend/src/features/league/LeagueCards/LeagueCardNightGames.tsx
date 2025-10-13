import { LeagueCardData } from "../useLeagueCards";
import { Player } from "../../../types";

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
}) => {
  const pointDifference = weekPoints - opponentWeekPoints;
  const isWinning = pointDifference > 0;
  const remainingNum = remainingPlayers.length;
  const opponentRemainingNum = opponentRemainingPlayers.length;
  const remainingDifference = remainingNum - opponentRemainingNum;
  const avgPlayerScore = 13;

  if (isWinning && opponentRemainingNum === 0) {
    return {
      result: "Win",
      complete: true,
      closeGame: false, // TODO: Still want to make a way to display a game thats over was close
    };
  } else if (!isWinning && remainingNum === 0) {
    return {
      result: "Loss",
      complete: true,
      closeGame: false,
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
      const perPlayerDifference = Math.abs(
        adjustedDifference / opponentRemainingNum
      );

      return perPlayerDifference;
    } else {
      if (opponentRemainingNum === 0) {
        return Math.abs(pointDifference / remainingNum);
      }

      const adjustedDifference =
        pointDifference + avgPlayerScore * opponentRemainingNum;
      const perPlayerDifference = Math.abs(adjustedDifference / remainingNum);

      return perPlayerDifference;
    }
  })();

  if (amountPerPlayerLosingTeamNeeds / avgPlayerScore > 3) {
    if (isWinning) {
      return {
        result: "Winning",
        complete: false,
        closeGame: false,
      };
    } else {
      return {
        result: "Losing",
        complete: false,
        closeGame: false,
      };
    }
  }

  if (isWinning) {
    return {
      result: "Winning",
      complete: false,
      closeGame: true,
    };
  }

  return {
    result: "Losing",
    complete: false,
    closeGame: true,
  };
};

export const LeagueCardNightGames = ({ data }: { data: LeagueCardData }) => {
  const { team, opponent } = data;
  const { weekPoints, weekPointsAgainst, playerData } = team;

  let playerRemainingOpponent;
  let opponentPlayerData;
  let opponentWeekPoints;
  let opponentWeekPointsAgainst;
  if (opponent) {
    opponentPlayerData = opponent.playerData;
    opponentWeekPoints = opponent.weekPoints;
    opponentWeekPointsAgainst = opponent.weekPointsAgainst;
    playerRemainingOpponent = opponent.playerData.filter(
      (player) => player.playedStatus !== "completed"
    );
  }

  const playerRemainingTeam = playerData.filter(
    (player) => player.playedStatus !== "completed"
  );

  if (!weekPoints) {
    return <div>Error: No week points</div>;
  }

  const matchupStatus =
    opponentWeekPoints && playerRemainingOpponent && playerRemainingTeam
      ? getResultVsOpponent({
          weekPoints,
          opponentWeekPoints,
          opponentRemainingPlayers: playerRemainingOpponent,
          remainingPlayers: playerRemainingTeam,
        })
      : null;
  return <div>{matchupStatus?.result}</div>;
};
