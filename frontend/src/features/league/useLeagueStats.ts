import { LeagueStats, LeagueStatsMap, UserTeams } from "../view/ViewContext";
import { useMemo } from "react";

export const useLeagueStats = ({
  userTeams,
}: {
  userTeams: UserTeams;
}): LeagueStatsMap => {
  const leagueStatsMap = useMemo(() => {
    let localLeagueStatsMap: LeagueStatsMap = {};
    Object.entries(userTeams).forEach(([season, seasonLeagues]) => {
      if (!localLeagueStatsMap[season]) {
        localLeagueStatsMap[season] = {};
      }
      Object.entries(seasonLeagues).forEach(([leagueId, league]) => {
        const averagePointsFor = league.stats.pointsFor / (league.stats.wins + league.stats.losses + league.stats.ties);
        localLeagueStatsMap[season][leagueId] = {
          ...league.stats,
          averagePointsFor,
        };
      });
    });
    return localLeagueStatsMap;
  }, [userTeams]);

  return leagueStatsMap;
};
