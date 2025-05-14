import { Timestamp } from "firebase-admin/firestore";

export type TradeStatus = 'pending' | 'completed' | 'rejected' | 'canceled' | 'vetoed' | 'invalidated';

export interface TradedPlayer {
  playerId: string;
  name: string;
  position: string;
  team?: string;
  fromTeamId: string;
  toTeamId: string;
}

export interface TradedDraftPick {
  season: string | number;
  round: number;
  originalTeamId?: string;
  fromTeamId: string;
  toTeamId: string;
}

export interface TradeParticipant {
  teamId: string;
  teamName: string;
  externalTeamId: string;
  ownerId: string;
  ownerName?: string;
  playersGiven: TradedPlayer[];
  playersReceived: TradedPlayer[];
  picksGiven: TradedDraftPick[];
  picksReceived: TradedDraftPick[];
}

export interface Trade {
  id?: string;
  externalTradeId: string;
  leagueId: string;
  externalLeagueId: string;
  platformId: string;
  status: TradeStatus;
  participants: TradeParticipant[];
  proposedAt: Timestamp | Date;
  executedAt?: Timestamp | Date;
  description?: string;
  metadata?: Record<string, any>;
  lastSynced: Timestamp | Date;
}

/**
 * Converts platform-specific trade data to the common Trade model
 */
export interface TradeConverter<T> {
  convertToTrade(
    platformTradeData: T, 
    leagueId: string, 
    externalLeagueId: string, 
    platformId: string
  ): Trade;
} 