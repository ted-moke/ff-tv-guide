import { LeagueCardData, useLeagueCards } from "../useLeagueCards";
import { useMemo } from "react";
import { LeagueCardWeekRemaining } from "./LeagueCardWeekRemaining";

const sortGamesForRemainings = (games: LeagueCardData[]) => {
  // sort them by first close games, then close and winning, then close and losing, then complete games
  const sortedForCloseGames = games.sort((a, b) => {
    if (a.matchupStatus?.closeGame && !b.matchupStatus?.closeGame) {
      return -1;
    }
    return 1;
  });

  const sortedForCloseAndWinning = sortedForCloseGames.sort((a, b) => {
    if (
      a.matchupStatus?.result === "Win" &&
      b.matchupStatus?.result !== "Win"
    ) {
      return -1;
    }
    return 1;
  });

  const sortedForCloseAndLosing = sortedForCloseAndWinning.sort((a, b) => {
    if (
      a.matchupStatus?.result === "Loss" &&
      b.matchupStatus?.result !== "Loss"
    ) {
      return -1;
    }
    return 1;
  });

  return sortedForCloseAndLosing;
};

export const LeagueCardsRemainingSection = () => {
  const { leagueCardsData } = useLeagueCards();

  if (!leagueCardsData || leagueCardsData.length === 0) {
    return null;
  }

  let incompleteGames = leagueCardsData.filter(
    (data) => !data.matchupStatus?.complete
  );
  let completeGames = leagueCardsData.filter(
    (data) => data.matchupStatus?.complete
  );
  const sortedIncomplete = useMemo(() => {
    return sortGamesForRemainings(incompleteGames);
  }, [leagueCardsData]);

  const sortedComplete = useMemo(() => {
    return sortGamesForRemainings(completeGames);
  }, [leagueCardsData]);

  return (
    <div>
      {sortedIncomplete.map((data) => (
        <LeagueCardWeekRemaining data={data} />
      ))}
      {sortedComplete.map((data) => (
        <LeagueCardWeekRemaining data={data} />
      ))}
    </div>
  );
};
