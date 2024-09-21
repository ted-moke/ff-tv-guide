export interface League {
  id?: string; // Firestore document ID
  name: string;
  platform: {
    name: string;
    id: string;
  };
  externalLeagueId: string;
  lastModified: Date;
  settings?: {
    bestBall?: boolean;
    // Add other settings you want to track here
  };
}
