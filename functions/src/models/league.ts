export interface League {
  name: string;
  platform: { name: "sleeper" | "fleaflicker"; id: string };
  externalLeagueId: string;
}
