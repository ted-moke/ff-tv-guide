import { NFL_TEAMS } from "../nfl/nflTeams";

// accepts a team name and returns the team code
export const getTeamCodesByName = (teamName: string) => {
  const team = NFL_TEAMS.find(team => team.name === teamName);
  return team?.codes;
};


