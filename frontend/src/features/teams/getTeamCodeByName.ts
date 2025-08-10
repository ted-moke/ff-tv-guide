import { NFL_TEAMS } from "../nfl/nflTeams";

// accepts a team name and returns the team code
export const getTeamCodeByName = (teamName: string) => {
  const team = NFL_TEAMS.find(team => team.name === teamName);
  return team?.codes[0];
};


