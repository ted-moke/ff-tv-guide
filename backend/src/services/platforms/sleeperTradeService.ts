import { getDb } from "../../firebase";
import { Trade, TradeConverter, TradeParticipant, TradeStatus, TradedDraftPick, TradedPlayer } from "../../models/trade";
import { SleeperTransaction, SleeperTransactionDraftPick } from "../../types/sleeperTypes";
import fetchFromUrl from "../../utils/fetchFromUrl";
import { TradeService } from "../tradeService";

export class SleeperTradeService implements TradeService, TradeConverter<SleeperTransaction> {
  private static instance: SleeperTradeService;
  private nflPlayers: Record<string, any>;

  private constructor() {
    // Initialize with empty object, can be populated later if needed
    this.nflPlayers = {};
  }

  public static getInstance(): SleeperTradeService {
    if (!SleeperTradeService.instance) {
      SleeperTradeService.instance = new SleeperTradeService();
    }
    return SleeperTradeService.instance;
  }

  async fetchTrades(leagueId: string, externalLeagueId: string): Promise<Trade[]> {
    try {
      // Fetch all transactions from Sleeper API
      const transactions = await this.fetchTransactions(externalLeagueId);
      
      // Filter to only include trades
      const trades = transactions.filter(transaction => 
        transaction.type === 'trade' && transaction.status !== 'failed'
      );
      
      // Convert to our common trade model
      return trades.map(trade => 
        this.convertToTrade(trade, leagueId, externalLeagueId, 'sleeper')
      );
    } catch (error) {
      console.error('Error fetching Sleeper trades:', error);
      throw new Error(`Failed to fetch Sleeper trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async syncTrades(leagueId: string, externalLeagueId: string): Promise<void> {
    try {
      const db = await getDb();
      const tradesCollection = db.collection('trades');
      
      // Fetch trades from Sleeper
      const trades = await this.fetchTrades(leagueId, externalLeagueId);
      
      // Batch write to Firestore
      const batch = db.batch();
      
      for (const trade of trades) {
        // Check if trade already exists
        const existingTradeQuery = await tradesCollection
          .where('externalTradeId', '==', trade.externalTradeId)
          .where('leagueId', '==', leagueId)
          .limit(1)
          .get();
        
        if (!existingTradeQuery.empty) {
          // Update existing trade
          const existingTradeDoc = existingTradeQuery.docs[0];
          batch.update(existingTradeDoc.ref, { 
            ...trade, 
            id: existingTradeDoc.id,
            lastSynced: new Date()
          });
        } else {
          // Create new trade
          const newTradeRef = tradesCollection.doc();
          batch.set(newTradeRef, { 
            ...trade, 
            id: newTradeRef.id,
            lastSynced: new Date()
          });
        }
      }
      
      await batch.commit();
      console.log(`Synced ${trades.length} Sleeper trades for league ${leagueId}`);
    } catch (error) {
      console.error('Error syncing Sleeper trades:', error);
      throw new Error(`Failed to sync Sleeper trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchTransactions(externalLeagueId: string): Promise<SleeperTransaction[]> {
    // Sleeper API returns transactions by week, so we need to fetch all weeks
    // For simplicity, let's fetch weeks 1-17 (adjust as needed)
    const allTransactions: SleeperTransaction[] = [];
    
    for (let week = 1; week <= 17; week++) {
      try {
        const url = `https://api.sleeper.app/v1/league/${externalLeagueId}/transactions/${week}`;
        const weekTransactions = await fetchFromUrl(url);
        if (Array.isArray(weekTransactions)) {
          allTransactions.push(...weekTransactions);
        }
      } catch (error) {
        console.warn(`Error fetching week ${week} transactions:`, error);
        // Continue with other weeks even if one fails
      }
    }
    
    return allTransactions;
  }

  convertToTrade(
    transaction: SleeperTransaction, 
    leagueId: string, 
    externalLeagueId: string, 
    platformId: string
  ): Trade {
    // Map Sleeper status to our common status
    const statusMap: Record<string, TradeStatus> = {
      'complete': 'completed',
      'pending': 'pending',
      'rejected': 'rejected',
      'canceled': 'canceled',
      'vetoed': 'vetoed',
      'failed': 'invalidated'
    };
    
    // Create a map of roster_id to participant
    const participants: TradeParticipant[] = transaction.roster_ids.map(rosterId => ({
      teamId: '', // Will be populated later when we have team data
      teamName: `Team ${rosterId}`, // Default name
      externalTeamId: rosterId.toString(),
      ownerId: '', // Will be populated later when we have owner data
      ownerName: '',
      playersGiven: [],
      playersReceived: [],
      picksGiven: [],
      picksReceived: []
    }));
    
    // Process player adds/drops
    if (transaction.adds && transaction.drops) {
      // Map of player_id to receiving roster_id
      const playerAdds = transaction.adds;
      
      // Map of player_id to giving roster_id
      const playerDrops = transaction.drops;
      
      // Process each player being traded
      for (const [playerId, toRosterId] of Object.entries(playerAdds)) {
        const fromRosterId = playerDrops[playerId];
        if (!fromRosterId) continue; // Not a trade, just an add
        
        const playerInfo = this.nflPlayers[playerId] || {
          full_name: `Player ${playerId}`,
          position: 'Unknown',
          team: 'Unknown'
        };
        
        const tradedPlayer: TradedPlayer = {
          playerId,
          name: playerInfo.full_name,
          position: playerInfo.position,
          team: playerInfo.team,
          fromTeamId: fromRosterId,
          toTeamId: toRosterId
        };
        
        // Add to the appropriate participant's lists
        const fromParticipant = participants.find(p => p.externalTeamId === fromRosterId);
        const toParticipant = participants.find(p => p.externalTeamId === toRosterId);
        
        if (fromParticipant) fromParticipant.playersGiven.push(tradedPlayer);
        if (toParticipant) toParticipant.playersReceived.push(tradedPlayer);
      }
    }
    
    // Process draft picks
    if (transaction.draft_picks && transaction.draft_picks.length > 0) {
      for (const pick of transaction.draft_picks) {
        const tradedPick: TradedDraftPick = this.convertDraftPick(pick);
        
        // Add to the appropriate participant's lists
        const fromParticipant = participants.find(p => p.externalTeamId === tradedPick.fromTeamId);
        const toParticipant = participants.find(p => p.externalTeamId === tradedPick.toTeamId);
        
        if (fromParticipant) fromParticipant.picksGiven.push(tradedPick);
        if (toParticipant) toParticipant.picksReceived.push(tradedPick);
      }
    }
    
    return {
      externalTradeId: transaction.transaction_id,
      leagueId,
      externalLeagueId,
      platformId,
      status: statusMap[transaction.status] || 'pending',
      participants,
      proposedAt: new Date(transaction.created),
      executedAt: transaction.status === 'complete' ? 
        (transaction.status_updated ? new Date(transaction.status_updated) : new Date(transaction.created)) : 
        undefined,
      description: transaction.metadata?.notes || '',
      metadata: {
        leg: transaction.leg,
        consenterIds: transaction.consenter_ids,
        creator: transaction.creator
      },
      lastSynced: new Date()
    };
  }

  private convertDraftPick(pick: SleeperTransactionDraftPick): TradedDraftPick {
    return {
      season: pick.season,
      round: pick.round,
      originalTeamId: pick.roster_id.toString(),
      fromTeamId: pick.previous_owner_id.toString(),
      toTeamId: pick.owner_id.toString()
    };
  }
} 