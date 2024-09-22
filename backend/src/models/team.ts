export interface Team {
  id?: string;
  externalTeamId: string;
  leagueId: string;
  // TODO abstract leagueId and externalLeagueId to a league model, so team.league.id
  externalLeagueId: string;
  leagueName: string;
  name?: string;
  externalUsername?: string;
  externalUserId?: string;
  platformId: string;
  opponentId: string;
  playerData: Player[];
}

export interface Player {
  name: string;
  logicalName: string;
  team: string;
  position: string;
  rosterSlotType: "start" | "bench" | "ir" | "taxi" | "reserve";
}
