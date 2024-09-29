
export interface FantasyTeam {
  id: string;
  leagueName: string;
  opponentId: string;
  externalUserId: string;
  leagueId: string;
  externalLeagueId: string;
  platformId: string;
  name: string;
  externalTeamId: string;
  externalUsername: string,
  playerData: Array<{
    name: string;
    team: string;
    position: string;
    rosterSlotType: string;
  }>;
  stats: {
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
  };
  // Add other properties if needed
}