export interface League {
  id?: string;  // Firestore document ID
  name: string;
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string;
}
