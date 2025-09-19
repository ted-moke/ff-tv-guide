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
            const awayTeamNflArr = getTeamByName(game.awayTeam)?.codes;
            const homeTeamNflArr = getTeamByName(game.homeTeam)?.codes;

            if (awayTeamNflArr) {
                awayTeamNflArr.forEach((awayTeamNfl) => {
                    teamPlayedStatusMap.completed.add(awayTeamNfl);
                });
            }
            if (homeTeamNflArr) {
                homeTeamNflArr.forEach((homeTeamNfl) => {
                    teamPlayedStatusMap.completed.add(homeTeamNfl);
                });
            }
        });
    });

    weeklySchedule.games.inProgress.forEach((bucket) => {
        bucket.games.forEach((game) => {
            const awayTeamNflArr = getTeamByName(game.awayTeam)?.codes;
            const homeTeamNflArr = getTeamByName(game.homeTeam)?.codes;
            if (awayTeamNflArr) {
                awayTeamNflArr.forEach((awayTeamNfl) => {
                    teamPlayedStatusMap.inProgress.add(awayTeamNfl);
                });
            }
            if (homeTeamNflArr) {
                homeTeamNflArr.forEach((homeTeamNfl) => {
                    teamPlayedStatusMap.inProgress.add(homeTeamNfl);
                });
            }
        });
    });

    weeklySchedule.games.upcoming.forEach((bucket) => {
        bucket.games.forEach((game) => {
            const awayTeamNflArr = getTeamByName(game.awayTeam)?.codes;
            const homeTeamNflArr = getTeamByName(game.homeTeam)?.codes;
            if (awayTeamNflArr) {
                awayTeamNflArr.forEach((awayTeamNfl) => {
                    teamPlayedStatusMap.upcoming.add(awayTeamNfl);
                });
            }
            if (homeTeamNflArr) {
                homeTeamNflArr.forEach((homeTeamNfl) => {
                    teamPlayedStatusMap.upcoming.add(homeTeamNfl);
                });
            }
        });
    });

    return teamPlayedStatusMap;
}
