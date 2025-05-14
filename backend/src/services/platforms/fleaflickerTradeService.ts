import { getDb } from "../../firebase";
import { Trade, TradeConverter, TradeParticipant, TradeStatus, TradedDraftPick, TradedPlayer } from "../../models/trade";
import { FleaflickerDraftPick, FleaflickerLeaguePlayer, FleaflickerTrade } from "../../types/fleaflickerTypes";
import fetchFromUrl from "../../utils/fetchFromUrl";
import { TradeService } from "../tradeService";

export class FleaflickerTradeService implements TradeService, TradeConverter<FleaflickerTrade> {
  private static instance: FleaflickerTradeService;

  private constructor() {}

  public static getInstance(): FleaflickerTradeService {
    if (!FleaflickerTradeService.instance) {
      FleaflickerTradeService.instance = new FleaflickerTradeService();
    }
    return FleaflickerTradeService.instance;
  }

  async fetchTrades(leagueId: string, externalLeagueId: string): Promise<Trade[]> {
    try {
      // Fetch trades from Fleaflicker API
      const trades = await this.fetchFleaflickerTrades(externalLeagueId);
      
      // Convert to our common trade model
      return trades.map(trade => 
        this.convertToTrade(trade, leagueId, externalLeagueId, 'fleaflicker')
      );
    } catch (error) {
      console.error('Error fetching Fleaflicker trades:', error);
      throw new Error(`Failed to fetch Fleaflicker trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async syncTrades(leagueId: string, externalLeagueId: string): Promise<void> {
    try {
      const db = await getDb();
      const tradesCollection = db.collection('trades');
      
      // Fetch trades from Fleaflicker
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
      console.log(`Synced ${trades.length} Fleaflicker trades for league ${leagueId}`);
    } catch (error) {
      console.error('Error syncing Fleaflicker trades:', error);
      throw new Error(`Failed to sync Fleaflicker trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchFleaflickerTrades(externalLeagueId: string): Promise<FleaflickerTrade[]> {
    const url = `https://www.fleaflicker.com/api/FetchTrades?sport=NFL&league_id=${externalLeagueId}&filter=TRADES_COMPLETED`;
    const response = await fetchFromUrl(url);
    
    if (response && response.trades && Array.isArray(response.trades)) {
      return response.trades;
    }
    
    return [];
  }

  convertToTrade(
    trade: FleaflickerTrade, 
    leagueId: string, 
    externalLeagueId: string, 
    platformId: string
  ): Trade {
    // Map Fleaflicker status to our common status
    const statusMap: Record<string, TradeStatus> = {
      'TRADE_STATUS_OPEN': 'pending',
      'TRADE_STATUS_EXECUTED': 'completed',
      'TRADE_STATUS_REJECTED': 'rejected',
      'TRADE_STATUS_CANCELED': 'canceled',
      'TRADE_STATUS_VETOED': 'vetoed',
      'TRADE_STATUS_INVALIDATED': 'invalidated'
    };
    
    // Create participants from the teams involved
    const participants: TradeParticipant[] = trade.teams.map(teamData => {
      const team = teamData.team;
      const primaryOwner = team.owners && team.owners.length > 0 ? team.owners[0] : null;
      
      return {
        teamId: '', // Will be populated later when we have internal team data
        teamName: team.name,
        externalTeamId: team.id.toString(),
        ownerId: primaryOwner ? primaryOwner.id.toString() : '',
        ownerName: primaryOwner ? primaryOwner.displayName : '',
        playersGiven: this.convertPlayersReleased(teamData.playersReleased || [], team.id.toString()),
        playersReceived: this.convertPlayersObtained(teamData.playersObtained || [], team.id.toString()),
        picksGiven: this.convertPicksReleased(teamData.picksReleased || [], team.id.toString()),
        picksReceived: this.convertPicksObtained(teamData.picksObtained || [], team.id.toString())
      };
    });

    return {
      externalTradeId: trade.id.toString(),
      leagueId,
      externalLeagueId,
      platformId,
      status: statusMap[trade.status] || 'pending',
      participants,
      proposedAt: trade.proposedOn ? new Date(parseInt(trade.proposedOn)) : new Date(),
      executedAt: trade.approvedOn ? new Date(parseInt(trade.approvedOn)) : undefined,
      description: trade.description || '',
      metadata: {
        tentativeExecutionTime: trade.tentativeExecutionTime || null,
        numVetoes: trade.numVetoes || 0,
        numVetoesRequired: trade.numVetoesRequired || 0,
        isOwnerInvolved: trade.isOwnerInvolved || false,
        eligibleActions: trade.eligibleActions || []
      },
      lastSynced: new Date()
    };
  }

  private convertPlayersObtained(players: FleaflickerLeaguePlayer[], toTeamId: string): TradedPlayer[] {
    // For players obtained, we need to find which team they came from
    // This is a simplification - in a real implementation, you'd need to track this properly
    return players.map(player => {
      const proPlayer = player.proPlayer;
      return {
        playerId: proPlayer.id.toString(),
        name: proPlayer.nameFull,
        position: proPlayer.position,
        team: proPlayer.proTeamAbbreviation,
        fromTeamId: 'unknown', // In Fleaflicker, we may need additional logic to determine this
        toTeamId
      };
    });
  }

  private convertPlayersReleased(players: FleaflickerLeaguePlayer[], fromTeamId: string): TradedPlayer[] {
    return players.map(player => {
      const proPlayer = player.proPlayer;
      return {
        playerId: proPlayer.id.toString(),
        name: proPlayer.nameFull,
        position: proPlayer.position,
        team: proPlayer.proTeamAbbreviation,
        fromTeamId,
        toTeamId: 'unknown' // In Fleaflicker, we may need additional logic to determine this
      };
    });
  }

  private convertPicksObtained(picks: FleaflickerDraftPick[], toTeamId: string): TradedDraftPick[] {
    // Filter out invalid picks
    const validPicks = picks.filter(pick => pick && typeof pick === 'object');
    
    return validPicks.map(pick => ({
      season: pick.season || new Date().getFullYear() + 1,
      round: pick.round || 1,
      originalTeamId: pick.originalOwner ? pick.originalOwner.id.toString() : undefined,
      fromTeamId: pick.currentOwner ? pick.currentOwner.id.toString() : 'unknown',
      toTeamId
    }));
  }

  private convertPicksReleased(picks: FleaflickerDraftPick[], fromTeamId: string): TradedDraftPick[] {
    // Filter out invalid picks
    const validPicks = picks.filter(pick => pick && typeof pick === 'object');
    
    return validPicks.map(pick => ({
      season: pick.season || new Date().getFullYear() + 1,
      round: pick.round || 1,
      originalTeamId: pick.originalOwner ? pick.originalOwner.id.toString() : undefined,
      fromTeamId,
      toTeamId: pick.currentOwner ? pick.currentOwner.id.toString() : 'unknown'
    }));
  }
} 