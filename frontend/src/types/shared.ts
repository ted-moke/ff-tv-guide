  // Shared types that can be used across frontend and backend

import { RosterSlotType } from "../features/nfl/nflTypes";

export interface Player {
  name: string;
  logicalName: string;
  team: string;
  position: string;
  rosterSlotType: RosterSlotType;
  playedStatus: PlayedStatus;
}

export type PlayedStatus = 'completed' | 'inProgress' | 'upcoming' | 'unknown';

export interface TeamStats {
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  averagePointsFor: number;
  pointsAgainst: number;
  playerStatusCount?: Record<PlayedStatus, number>;
  winPercentage?: number;
}

export interface Team {
  id?: string;
  externalTeamId: string;
  leagueId: string;
  leagueMasterId: string;
  externalLeagueId: string;
  leagueName: string;
  shortLeagueName: string;
  season: number;
  name?: string;
  externalUsername?: string;
  externalUserId?: string;
  platformId: string;
  points: number;
  opponentId: string | null;
  coOwners: string[];
  playerData: Player[];
  stats: TeamStats;
  lastSynced: Date;
  lastFetched: Date;
  weekPoints?: number;
  weekPointsAgainst?: number;
  isBestBall?: boolean;
}


export interface League {
  id?: string;
  leagueMasterId: string;
  name: string;
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string;
  season: number;
  lastModified: Date;
  settings?: {
    isBestBall?: boolean;
  }
}

export interface LeagueMaster {
  id?: string;
  name: string;
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

export interface UserTeam {
  userId: string;
  leagueMasterId: string;
  teamId: string;
  currentSeason: number;
}

// Frontend-specific types that extend shared types
export interface FantasyTeam extends Team {
  needsUpdate: boolean; // Frontend schema only
  visibilityType: "show" | "hide" | "archive";
  playedStatus: PlayedStatus;
}

export interface TeamHistoryData {
  leagueMaster: LeagueMaster;
  seasons: {
    season: number;
    league: League;
    team: Team;
    stats: TeamStats;
  }[];
}
