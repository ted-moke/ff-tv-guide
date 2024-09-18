export interface Team {
  id?: string; // Add this line
  externalTeamId: string;
  leagueId: string;
  leagueName: string;
  name?: string;
  externalUsername?: string;
  externalUserId?: string;
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
