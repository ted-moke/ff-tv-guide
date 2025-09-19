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
    if (teamPlayedStatusMap.completed.has(player.team)) {
      player.playedStatus = "completed";
      if (player.rosterSlotType === "bench") {
        return;
      }
      team.stats.playerStatusCount!.completed++;
    } else if (teamPlayedStatusMap.inProgress.has(player.team)) {
      player.playedStatus = "inProgress";
      if (player.rosterSlotType === "bench") {
        return;
      }
      team.stats.playerStatusCount!.inProgress++;
    } else if (teamPlayedStatusMap.upcoming.has(player.team)) {
      player.playedStatus = "upcoming";
      if (player.rosterSlotType === "bench") {
        return;
      }
      team.stats.playerStatusCount!.upcoming++;
    } else {
      player.playedStatus = "unknown";
      if (player.rosterSlotType === "bench") {
        return;
      }
      team.stats.playerStatusCount!.unknown++;
    }
  });
  return team;
};
