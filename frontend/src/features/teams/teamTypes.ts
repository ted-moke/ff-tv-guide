
export interface FantasyTeam {
  id: string;
  leagueName: string;
  opponentId: string;
  externalUserId: string;
  leagueId: string;
  name: string;
  externalTeamId: string;
  externalUsername: string,
  playerData: Array<{
    name: string;
    team: string;
    position: string;
    rosterSlotType: string;
  }>;
  // Add other properties if needed
}