import { NFLTeam } from './nflTypes';

export const NFL_TEAMS: { [key: string]: NFLTeam } = {
  ARI: { name: 'Arizona Cardinals', code: 'ARI', conference: 'NFC', division: 'West' },
  ATL: { name: 'Atlanta Falcons', code: 'ATL', conference: 'NFC', division: 'South' },
  BAL: { name: 'Baltimore Ravens', code: 'BAL', conference: 'AFC', division: 'North' },
  BUF: { name: 'Buffalo Bills', code: 'BUF', conference: 'AFC', division: 'East' },
  CAR: { name: 'Carolina Panthers', code: 'CAR', conference: 'NFC', division: 'South' },
  CHI: { name: 'Chicago Bears', code: 'CHI', conference: 'NFC', division: 'North' },
  CIN: { name: 'Cincinnati Bengals', code: 'CIN', conference: 'AFC', division: 'North' },
  CLE: { name: 'Cleveland Browns', code: 'CLE', conference: 'AFC', division: 'North' },
  DAL: { name: 'Dallas Cowboys', code: 'DAL', conference: 'NFC', division: 'East' },
  DEN: { name: 'Denver Broncos', code: 'DEN', conference: 'AFC', division: 'West' },
  DET: { name: 'Detroit Lions', code: 'DET', conference: 'NFC', division: 'North' },
  GB: { name: 'Green Bay Packers', code: 'GB', conference: 'NFC', division: 'North' },
  HOU: { name: 'Houston Texans', code: 'HOU', conference: 'AFC', division: 'South' },
  IND: { name: 'Indianapolis Colts', code: 'IND', conference: 'AFC', division: 'South' },
  JAX: { name: 'Jacksonville Jaguars', code: 'JAX', conference: 'AFC', division: 'South' },
  KC: { name: 'Kansas City Chiefs', code: 'KC', conference: 'AFC', division: 'West' },
  LV: { name: 'Las Vegas Raiders', code: 'LV', conference: 'AFC', division: 'West' },
  LAC: { name: 'Los Angeles Chargers', code: 'LAC', conference: 'AFC', division: 'West' },
  LAR: { name: 'Los Angeles Rams', code: 'LAR', conference: 'NFC', division: 'West' },
  MIA: { name: 'Miami Dolphins', code: 'MIA', conference: 'AFC', division: 'East' },
  MIN: { name: 'Minnesota Vikings', code: 'MIN', conference: 'NFC', division: 'North' },
  NE: { name: 'New England Patriots', code: 'NE', conference: 'AFC', division: 'East' },
  NO: { name: 'New Orleans Saints', code: 'NO', conference: 'NFC', division: 'South' },
  NYG: { name: 'New York Giants', code: 'NYG', conference: 'NFC', division: 'East' },
  NYJ: { name: 'New York Jets', code: 'NYJ', conference: 'AFC', division: 'East' },
  PHI: { name: 'Philadelphia Eagles', code: 'PHI', conference: 'NFC', division: 'East' },
  PIT: { name: 'Pittsburgh Steelers', code: 'PIT', conference: 'AFC', division: 'North' },
  SF: { name: 'San Francisco 49ers', code: 'SF', conference: 'NFC', division: 'West' },
  SEA: { name: 'Seattle Seahawks', code: 'SEA', conference: 'NFC', division: 'West' },
  TB: { name: 'Tampa Bay Buccaneers', code: 'TB', conference: 'NFC', division: 'South' },
  TEN: { name: 'Tennessee Titans', code: 'TEN', conference: 'AFC', division: 'South' },
  WAS: { name: 'Washington Commanders', code: 'WAS', conference: 'NFC', division: 'East' },
};

export const getTeamByName = (name: string): NFLTeam | undefined => {
  return Object.values(NFL_TEAMS).find(team => team.name === name);
};

export const getTeamByCode = (code: string): NFLTeam | undefined => {
  return NFL_TEAMS[code.toUpperCase()];
};