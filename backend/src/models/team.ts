import { Timestamp } from 'firebase-admin/firestore';

export interface Team {
  id?: string;
  externalTeamId: string;
  leagueId: string; // Points to season-specific League
  leagueMasterId: string; // Reference to LeagueMaster for cross-season queries
  externalLeagueId: string;
  leagueName: string;
  season: number; // 2024, 2025, etc.
  name?: string;
  externalUsername?: string;
  externalUserId?: string;
  platformId: string;
  opponentId: string | null;
  coOwners: string[];
  playerData: Player[];
  stats: {
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;  
  };
  lastSynced: Date;
  lastFetched: Timestamp  | Date;
}

export interface Player {
  name: string;
  logicalName: string;
  team: string;
  position: string;
  rosterSlotType: "start" | "bench" | "ir" | "taxi" | "reserve";
}
