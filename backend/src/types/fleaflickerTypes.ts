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
}

export interface RecordOverall {
  wins: number;
  winPercentage: {
    value: number;
    formatted: string;
  };
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

// Add any other Fleaflicker-specific types here