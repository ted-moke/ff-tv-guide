export interface Player {
  name: string;
  team: string;
}

export interface Team {
  name: string;
  division: string;
  conference: string;
  players: Player[];
}