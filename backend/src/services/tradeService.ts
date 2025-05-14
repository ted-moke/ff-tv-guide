import { Trade } from "../models/trade";

export interface TradeService {
  fetchTrades(leagueId: string, externalLeagueId: string): Promise<Trade[]>;
  syncTrades(leagueId: string, externalLeagueId: string): Promise<void>;
} 