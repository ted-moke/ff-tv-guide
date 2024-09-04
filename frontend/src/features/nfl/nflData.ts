import { Player } from "./nflTypes";

export const PLAYERS: Player[] = [
  { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', fantasyTeams: ["Tulsa Tango", "Papas Tatas"] },
  { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', fantasyTeams: ["Papas Tatas", "Southie Sizzlers", "Tulsa Tango"] },
  { name: 'Aaron Rodgers', team: 'Green Bay Packers', fantasyTeams: ["Southie Sizzlers"] },
  { name: 'Derrick Henry', team: 'Tennessee Titans', fantasyTeams: ["Tulsa Tango", "Papas Tatas"] },
  { name: 'Travis Kelce', team: 'Kansas City Chiefs', fantasyTeams: ["Papas Tatas"] },
  { name: 'Davante Adams', team: 'Las Vegas Raiders', fantasyTeams: ["Southie Sizzlers", "Tulsa Tango"] },
  { name: 'Josh Allen', team: 'Buffalo Bills', fantasyTeams: ["Tulsa Tango"] },
  { name: 'Tyreek Hill', team: 'Miami Dolphins', fantasyTeams: ["Papas Tatas"] },
  { name: 'Cooper Kupp', team: 'Los Angeles Rams', fantasyTeams: ["Southie Sizzlers"] },
  { name: 'Alvin Kamara', team: 'New Orleans Saints', fantasyTeams: ["Tulsa Tango"] },
  { name: 'Justin Jefferson', team: 'Minnesota Vikings', fantasyTeams: ["Papas Tatas", "Southie Sizzlers"] },
  { name: 'Stefon Diggs', team: 'Buffalo Bills', fantasyTeams: ["Southie Sizzlers"] },
];

export const NFL_TEAMS  = {
  AFC: [
    'Buffalo Bills', 'Miami Dolphins', 'New England Patriots', 'New York Jets',
    'Baltimore Ravens', 'Cincinnati Bengals', 'Cleveland Browns', 'Pittsburgh Steelers',
    'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Tennessee Titans',
    'Denver Broncos', 'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers'
  ],
  NFC: [
    'Dallas Cowboys', 'New York Giants', 'Philadelphia Eagles', 'Washington Commanders',
    'Chicago Bears', 'Detroit Lions', 'Green Bay Packers', 'Minnesota Vikings',
    'Atlanta Falcons', 'Carolina Panthers', 'New Orleans Saints', 'Tampa Bay Buccaneers',
    'Arizona Cardinals', 'Los Angeles Rams', 'San Francisco 49ers', 'Seattle Seahawks'
  ]
};