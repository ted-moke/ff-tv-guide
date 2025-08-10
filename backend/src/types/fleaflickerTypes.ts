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

// Fleaflicker Scoreboard/Matchups API Types
export interface FleaflickerScoreboardResponse {
  schedulePeriod: FleaflickerSchedulePeriod;
  eligibleSchedulePeriods: FleaflickerSchedulePeriod[];
  games: FleaflickerGame[];
}

export interface FleaflickerSchedulePeriod {
  ordinal: number;
  low: FleaflickerPeriodBound;
  high: FleaflickerPeriodBound;
  containsNow: boolean;
  value: number;
}

export interface FleaflickerPeriodBound {
  duration: string;
  ordinal: number;
  season: number;
  startEpochMilli: string; // int64 as string
  isNow: boolean;
  label: string;
}

export interface FleaflickerGame {
  id: string; // int64 as string
  away: FleaflickerGameTeam;
  home?: FleaflickerGameTeam; // Optional as it might not always be present
}

export interface FleaflickerGameTeam {
  id: number;
  name: string;
  sport: string;
  logoUrl: string;
  recordOverall: FleaflickerGameRecord;
  recordDivision?: FleaflickerGameRecord;
  recordPostseason?: FleaflickerGameRecord;
  pointsFor: FleaflickerGamePoints;
  pointsAgainst: FleaflickerGamePoints;
}

export interface FleaflickerGameRecord {
  wins: number;
  losses: number;
  ties: number;
  winPercentage: FleaflickerFormattedValue;
  rank: number;
  formatted: string;
}

export interface FleaflickerGamePoints {
  value: number;
  formatted: string;
}

export interface FleaflickerFormattedValue {
  value: number;
  formatted: string;
}

// Add any other Fleaflicker-specific types here