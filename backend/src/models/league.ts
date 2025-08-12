export interface League {
  id?: string; // Firestore document ID
  leagueMasterId: string; // Reference to LeagueMaster
  name: string;
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string;
  season: number; // 2024, 2025, etc.
  lastModified: Date;
}
