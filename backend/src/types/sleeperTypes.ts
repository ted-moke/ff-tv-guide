export type SleeperRoster = {
  roster_id: number;
  owner_id?: string;
  settings: {
    wins?: number;
    losses?: number;
    ties?: number;
    fpts?: number;
    fpts_decimal?: number;
    fpts_against?: number;
    fpts_against_decimal?: number;
  };
  co_owners?: string[] | null;
};

export type SleeperMatchup = {
  roster_id: number;
  matchup_id?: number | null;
  players: string[];
  starters: string[] | null;
};

export type SleeperTradedPick = {
  season: string;        // The season this pick is for (e.g., "2023")
  round: number;         // Which round the pick is (e.g., 1, 2, 3)
  roster_id: number;     // roster_id of the ORIGINAL owner
  previous_owner_id: number; // roster_id of the previous owner
  owner_id: number;      // roster_id of current owner
};

export type SleeperTransactionStatus = 'complete' | 'failed' | 'pending';
export type SleeperTransactionType = 'trade' | 'free_agent' | 'waiver' | 'commissioner';

export type SleeperTransactionDraftPick = {
  season: string;
  round: number;
  roster_id: number;
  previous_owner_id: number;
  owner_id: number;
};

export type SleeperTransactionSettings = {
  waiver_bid?: number;
  seq?: number;
};

export type SleeperTransaction = {
  type: SleeperTransactionType;
  transaction_id: string;
  status: SleeperTransactionStatus;
  status_updated: number | null;
  roster_ids: number[];
  metadata?: {
    notes?: string;
  };
  leg: number;
  drops?: Record<string, string>; // player_id -> roster_id
  adds?: Record<string, string>; // player_id -> roster_id
  draft_picks?: SleeperTransactionDraftPick[];
  creator: string;
  created: number;
  consenter_ids?: number[];
  waiver_budget?: Record<string, number>; // roster_id -> amount
  settings?: SleeperTransactionSettings;
};
