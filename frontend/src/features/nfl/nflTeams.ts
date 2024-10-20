import { NFLTeam, Conference } from './nflTypes';

export const NFL_TEAMS: NFLTeam[] = [
  { name: 'Arizona Cardinals', codes: ['ARI', 'ARZ'], conference: 'NFC', division: 'West' },
  { name: 'Atlanta Falcons', codes: ['ATL'], conference: 'NFC', division: 'South' },
  { name: 'Baltimore Ravens', codes: ['BAL'], conference: 'AFC', division: 'North' },
  { name: 'Buffalo Bills', codes: ['BUF'], conference: 'AFC', division: 'East' },
  { name: 'Carolina Panthers', codes: ['CAR'], conference: 'NFC', division: 'South' },
  { name: 'Chicago Bears', codes: ['CHI'], conference: 'NFC', division: 'North' },
  { name: 'Cincinnati Bengals', codes: ['CIN'], conference: 'AFC', division: 'North' },
  { name: 'Cleveland Browns', codes: ['CLE'], conference: 'AFC', division: 'North' },
  { name: 'Dallas Cowboys', codes: ['DAL'], conference: 'NFC', division: 'East' },
  { name: 'Denver Broncos', codes: ['DEN'], conference: 'AFC', division: 'West' },
  { name: 'Detroit Lions', codes: ['DET'], conference: 'NFC', division: 'North' },
  { name: 'Green Bay Packers', codes: ['GB', 'GBP'], conference: 'NFC', division: 'North' },
  { name: 'Houston Texans', codes: ['HOU'], conference: 'AFC', division: 'South' },
  { name: 'Indianapolis Colts', codes: ['IND'], conference: 'AFC', division: 'South' },
  { name: 'Jacksonville Jaguars', codes: ['JAX', 'JAC'], conference: 'AFC', division: 'South' },
  { name: 'Kansas City Chiefs', codes: ['KC', 'KCC'], conference: 'AFC', division: 'West' },
  { name: 'Las Vegas Raiders', codes: ['LV', 'LVR', 'OAK'], conference: 'AFC', division: 'West' },
  { name: 'Los Angeles Chargers', codes: ['LAC'], conference: 'AFC', division: 'West' },
  { name: 'Los Angeles Rams', codes: ['LAR'], conference: 'NFC', division: 'West' },
  { name: 'Miami Dolphins', codes: ['MIA'], conference: 'AFC', division: 'East' },
  { name: 'Minnesota Vikings', codes: ['MIN'], conference: 'NFC', division: 'North' },
  { name: 'New England Patriots', codes: ['NE', 'NEP'], conference: 'AFC', division: 'East' },
  { name: 'New Orleans Saints', codes: ['NO', 'NOS'], conference: 'NFC', division: 'South' },
  { name: 'New York Giants', codes: ['NYG'], conference: 'NFC', division: 'East' },
  { name: 'New York Jets', codes: ['NYJ'], conference: 'AFC', division: 'East' },
  { name: 'Philadelphia Eagles', codes: ['PHI'], conference: 'NFC', division: 'East' },
  { name: 'Pittsburgh Steelers', codes: ['PIT'], conference: 'AFC', division: 'North' },
  { name: 'San Francisco 49ers', codes: ['SF'], conference: 'NFC', division: 'West' },
  { name: 'Seattle Seahawks', codes: ['SEA'], conference: 'NFC', division: 'West' },
  { name: 'Tampa Bay Buccaneers', codes: ['TB', 'TBB'], conference: 'NFC', division: 'South' },
  { name: 'Tennessee Titans', codes: ['TEN'], conference: 'AFC', division: 'South' },
  { name: 'Washington Commanders', codes: ['WAS', 'WSH'], conference: 'NFC', division: 'East' },
];

export const getTeamByName = (name: string): NFLTeam | undefined => {
  return NFL_TEAMS.find(team => team.name === name);
};

export const getTeamByCode = (code: string): NFLTeam | undefined => {
  return NFL_TEAMS.find(team => team.codes.includes(code.toUpperCase()));
};

export const getTeamsByConference = (conference: Conference): NFLTeam[] => {
  return NFL_TEAMS.filter(team => team.conference === conference);
};
