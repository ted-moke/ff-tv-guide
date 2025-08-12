export interface UserTeam {
  userId: string;
  leagueMasterId: string; // Reference to LeagueMaster instead of specific league
  teamId: string; // Current season's team ID
  currentSeason: number; // Track which season this team is currently active
}
