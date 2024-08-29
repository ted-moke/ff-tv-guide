import { Team, Player } from '../types';

export function organizePlayersByTeam(data: any): Team[] {
  const teams: Team[] = [];

  Object.entries(data).forEach(([teamName, teamData]: [string, any]) => {
    const team: Team = {
      name: teamName,
      division: teamData.division,
      conference: teamData.conference,
      players: teamData.players.map((player: any) => ({
        name: player.name,
        team: player.team,
      })),
    };
    teams.push(team);
  });

  return teams;
}