export interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
  };
}

export const players: Player[] = [
  {
    id: 1,
    name: "LeBron James",
    position: "SF",
    team: "LAL",
    stats: { points: 25.7, rebounds: 7.9, assists: 7.6 }
  },
  {
    id: 2,
    name: "Stephen Curry",
    position: "PG",
    team: "GSW",
    stats: { points: 29.4, rebounds: 6.1, assists: 6.3 }
  },
  {
    id: 3,
    name: "Giannis Antetokounmpo",
    position: "PF",
    team: "MIL",
    stats: { points: 31.1, rebounds: 11.8, assists: 5.7 }
  },
  {
    id: 4,
    name: "Nikola Jokic",
    position: "C",
    team: "DEN",
    stats: { points: 24.5, rebounds: 11.8, assists: 9.8 }
  },
  {
    id: 5,
    name: "Luka Doncic",
    position: "PG",
    team: "DAL",
    stats: { points: 32.4, rebounds: 8.6, assists: 8.0 }
  },
  {
    id: 6,
    name: "Anthony Davis",
    position: "PF",
    team: "LAL",
    stats: { points: 23.2, rebounds: 12.5, assists: 3.1 }
  },
  {
    id: 7,
    name: "Klay Thompson",
    position: "SG",
    team: "GSW",
    stats: { points: 21.9, rebounds: 3.5, assists: 2.4 }
  },
  {
    id: 8,
    name: "Jayson Tatum",
    position: "SF",
    team: "BOS",
    stats: { points: 30.1, rebounds: 8.8, assists: 4.6 }
  },
  {
    id: 9,
    name: "Jaylen Brown",
    position: "SG",
    team: "BOS",
    stats: { points: 26.6, rebounds: 6.9, assists: 3.5 }
  },
  // Add more players as needed
];