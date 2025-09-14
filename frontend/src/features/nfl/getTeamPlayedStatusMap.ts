/**
 * Get the played status map for a team
 * @param weeklySchedule - The weekly schedule to get the played status map for
 * @returns A dict of dicts for each team with the played status
 */

import { BucketedGames } from "../../hooks/useWeeklySchedule";
import { getTeamByName } from "./nflTeams";

export interface TeamPlayedStatusMap {
    completed: Set<string>;
    inProgress: Set<string>;
    upcoming: Set<string>;
}

export const getTeamPlayedStatusMap = (weeklySchedule: BucketedGames | null) => {
    if (!weeklySchedule) {
        return null;
    }

    const teamPlayedStatusMap: TeamPlayedStatusMap = {
        completed: new Set(),
        inProgress: new Set(),
        upcoming: new Set(),
    };

    weeklySchedule.games.completed.forEach((bucket) => {
        bucket.games.forEach((game) => {
            const awayTeamNfl = getTeamByName(game.awayTeam)?.codes[0];
            const homeTeamNfl = getTeamByName(game.homeTeam)?.codes[0];

            if (awayTeamNfl) {
                teamPlayedStatusMap.completed.add(awayTeamNfl);
            }
            if (homeTeamNfl) {
                teamPlayedStatusMap.completed.add(homeTeamNfl);
            }
        });
    });

    weeklySchedule.games.inProgress.forEach((bucket) => {
        bucket.games.forEach((game) => {
            const awayTeamNfl = getTeamByName(game.awayTeam)?.codes[0];
            const homeTeamNfl = getTeamByName(game.homeTeam)?.codes[0];
            if (awayTeamNfl) {
                teamPlayedStatusMap.inProgress.add(awayTeamNfl);
            }
            if (homeTeamNfl) {
                teamPlayedStatusMap.inProgress.add(homeTeamNfl);
            }
        });
    });

    weeklySchedule.games.upcoming.forEach((bucket) => {
        bucket.games.forEach((game) => {
            const awayTeamNfl = getTeamByName(game.awayTeam)?.codes[0];
            const homeTeamNfl = getTeamByName(game.homeTeam)?.codes[0];
            if (awayTeamNfl) {
                teamPlayedStatusMap.upcoming.add(awayTeamNfl);
            }
            if (homeTeamNfl) {
                teamPlayedStatusMap.upcoming.add(homeTeamNfl);
            }
        });
    });

    return teamPlayedStatusMap;
}
