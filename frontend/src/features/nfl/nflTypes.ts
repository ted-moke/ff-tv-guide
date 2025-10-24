import { PlayedStatus } from "../../types/shared";
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

export type RosterSlotType = 'start' | 'bench' | 'bestBall';

export interface OwnedPlayer {
  platformId: string;
  leagueName: string;
  shortLeagueName: string;
  leagueId: string;
  externalLeagueId: string;
  rosterSlotType: RosterSlotType;
  team: 'self' | 'opponent';
}

export interface Player {
  name: string;
  team: string;
  position: string;
  playedStatus: PlayedStatus;
  copies: OwnedPlayer[];
}

export type Conference = 'AFC' | 'NFC' | 'Both';

export interface TeamColor {
  hex: string;
  rgb: string;
  isHiViz: boolean;
}

export interface TeamColors {
  primary: TeamColor;
  secondary: TeamColor;
  neutral: TeamColor;
}

export interface NFLTeam {
  name: string;
  codes: string[]; // Array of codes
  conference: string;
  division: string;
  colors: TeamColors;
}
