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
