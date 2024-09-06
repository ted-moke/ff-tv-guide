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

export interface Player {
  name: string;
  team: string;
  position: string;
  rosterSlotType: string;
  userTeams: string[];
  isStarter: boolean;
}

export type Conference = 'AFC' | 'NFC' | 'Both';

export interface NFLTeam {
  name: string;
  code: string;
  division: string;
  conference: 'AFC' | 'NFC';
}