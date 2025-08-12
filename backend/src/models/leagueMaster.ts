export interface LeagueMaster {
  id?: string; // Firestore document ID
  name: string; // "My Fantasy League" - human-readable name
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string; // The persistent external ID (Fleaflicker) or base ID (Sleeper)
  createdBy: string; // userId who first created this league
  createdAt: Date;
  lastModified: Date;
}
