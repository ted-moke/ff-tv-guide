export interface FleaflickerLeagueStandings {
  divisions: Division[];
}

export interface Division {
  id: number;
  name: string;
  teams: FleaflickerTeam[];
}

export interface FleaflickerTeam {
  id: number;
  name: string;
  logoUrl: string;
  recordOverall: RecordOverall;
  owners: Owner[];
  pointsFor: {
    value: number;
    formatted: string;
  };
  pointsAgainst: {
    value: number;
    formatted: string;
  };
}

export interface RecordOverall {
  wins: number;
  winPercentage: {
    value: number;
    formatted: string;
  };
  losses: number;
  ties: number;
  rank: number;
  formatted: string;
}

export interface Owner {
  id: number;
  displayName: string;
  lastSeen: string;
  initials: string;
  lastSeenIso: string;
}

// Fleaflicker Trade API Types
export type FleaflickerTradeStatus = 'TRADE_STATUS_OPEN' | 'TRADE_STATUS_REJECTED' | 'TRADE_STATUS_INVALIDATED' | 'TRADE_STATUS_EXECUTED' | 'TRADE_STATUS_VETOED' | 'TRADE_STATUS_CANCELED';

export type FleaflickerTradeAction = 'TRADE_REJECT' | 'TRADE_ACCEPT' | 'TRADE_CANCEL' | 'TRADE_COMMISH_CANCEL' | 'TRADE_COMMISH_EXECUTE' | 'TRADE_VETO' | 'TRADE_COUNTER';

export interface FleaflickerTradeResponse {
  trades: FleaflickerTrade[];
}

export interface FleaflickerTrade {
  id: number;
  tentativeExecutionTime?: string; // epoch milliseconds
  teams: FleaflickerTradeTeam[];
  description?: string;
  status: FleaflickerTradeStatus;
  eligibleActions?: FleaflickerTradeAction[];
  proposedOn?: string; // epoch milliseconds
  approvedOn?: string; // epoch milliseconds
  numVetoes?: number;
  numVetoesRequired?: number;
  isOwnerInvolved?: boolean;
}

export interface FleaflickerTradeTeam {
  team: FleaflickerTeam;
  playersObtained?: FleaflickerLeaguePlayer[];
  picksObtained?: FleaflickerDraftPick[];
  playersReleased?: FleaflickerLeaguePlayer[];
  picksReleased?: FleaflickerDraftPick[];
}

export interface FleaflickerLeaguePlayer {
  proPlayer: {
    id: number;
    nameFull: string;
    nameShort?: string;
    position: string;
    proTeamAbbreviation?: string;
    proTeam?: {
      abbreviation: string;
      location?: string;
      name?: string;
      isFreeAgent?: boolean;
    };
    injury?: {
      typeAbbreviation?: string;
      description?: string;
      severity?: string;
      typeFull?: string;
    };
  };
}

export interface FleaflickerDraftPick {
  season: number;
  round: number;
  slot?: number;
  originalOwner?: FleaflickerTeam;
  currentOwner?: FleaflickerTeam;
}

// Add any other Fleaflicker-specific types here