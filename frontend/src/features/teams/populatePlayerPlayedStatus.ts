/**
 * Populate the played status for each player in a team
 * @param team - The team to populate the played status for
 * @param teamPlayedStatusMap - The team played status map
 * @returns The team with the played status populated
 */

import { FantasyTeam } from "./teamTypes";
import { TeamPlayedStatusMap } from "../nfl/getTeamPlayedStatusMap";

export const populatePlayerPlayedStatus = (
  team: FantasyTeam,
  teamPlayedStatusMap: TeamPlayedStatusMap
) => {
  team.stats.playerStatusCount = {
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    unknown: 0,
  };
  team.playerData.forEach((player) => {
    if (player.rosterSlotType === "bench") {
      return;
    }
    if (teamPlayedStatusMap.completed.has(player.team)) {
      team.stats.playerStatusCount!.completed++;
      player.playedStatus = "completed";
    } else if (teamPlayedStatusMap.inProgress.has(player.team)) {
      team.stats.playerStatusCount!.inProgress++;
      player.playedStatus = "inProgress";
    } else if (teamPlayedStatusMap.upcoming.has(player.team)) {
      team.stats.playerStatusCount!.upcoming++;
      player.playedStatus = "upcoming";
    } else {
      team.stats.playerStatusCount!.unknown++;
      player.playedStatus = "unknown";
    }
  });
  return team;
};
