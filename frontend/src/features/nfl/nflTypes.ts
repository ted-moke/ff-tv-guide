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
  leagueName: string;
  shortLeagueName: string;
  leagueId: string;
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
  code: string;
  division: string;
  conference: 'AFC' | 'NFC';
}