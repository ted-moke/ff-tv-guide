export interface NFLGame {
  date: string;
  time: string;
  awayTeam: string;
  homeTeam: string;
  channel: string;
  location: string;
  notes?: string;
}

// export interface Player {
//   name: string;
//   team: string;
//   fantasyTeams: string[];
// }

export interface OwnedPlayer {
  platformId: string;
  leagueName: string;
  shortLeagueName: string;
  leagueId: string;
  externalLeagueId: string;
  rosterSlotType: 'start' | 'bench' | 'bestBall';
  team: 'self' | 'opponent';
}
export interface Player {
  name: string;
  team: string;
  position: string;
  copies: OwnedPlayer[];
}

export type Conference = 'AFC' | 'NFC' | 'Both';

export interface NFLTeam {
  name: string;
  codes: string[]; // Array of codes
  conference: string;
  division: string;
}
