import { NFLTeam, Conference, TeamColors } from './nflTypes';

export const NFL_TEAMS: NFLTeam[] = [
  { 
    name: 'Arizona Cardinals', 
    codes: ['ARI', 'ARZ'], 
    conference: 'NFC', 
    division: 'West',
    colors: {
      primary: { hex: '#97233F', rgb: 'rgb(151, 35, 63)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Atlanta Falcons', 
    codes: ['ATL'], 
    conference: 'NFC', 
    division: 'South',
    colors: {
      primary: { hex: '#A71930', rgb: 'rgb(167, 25, 48)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Baltimore Ravens', 
    codes: ['BAL'], 
    conference: 'AFC', 
    division: 'North',
    colors: {
      primary: { hex: '#4A2C8A', rgb: 'rgb(74, 44, 138)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Buffalo Bills', 
    codes: ['BUF'], 
    conference: 'AFC', 
    division: 'East',
    colors: {
      primary: { hex: '#1A5BB8', rgb: 'rgb(26, 91, 184)', isHiViz: true },
      secondary: { hex: '#C60C30', rgb: 'rgb(198, 12, 48)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Carolina Panthers', 
    codes: ['CAR'], 
    conference: 'NFC', 
    division: 'South',
    colors: {
      primary: { hex: '#0085CA', rgb: 'rgb(0, 133, 202)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Chicago Bears', 
    codes: ['CHI'], 
    conference: 'NFC', 
    division: 'North',
    colors: {
      primary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      secondary: { hex: '#C83803', rgb: 'rgb(200, 56, 3)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Cincinnati Bengals', 
    codes: ['CIN'], 
    conference: 'AFC', 
    division: 'North',
    colors: {
      primary: { hex: '#FB4F14', rgb: 'rgb(251, 79, 20)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Cleveland Browns', 
    codes: ['CLE'], 
    conference: 'AFC', 
    division: 'North',
    colors: {
      primary: { hex: '#4A2F00', rgb: 'rgb(74, 47, 0)', isHiViz: false },
      secondary: { hex: '#FF3C00', rgb: 'rgb(255, 60, 0)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Dallas Cowboys', 
    codes: ['DAL'], 
    conference: 'NFC', 
    division: 'East',
    colors: {
      primary: { hex: '#1A5BB8', rgb: 'rgb(26, 91, 184)', isHiViz: true },
      secondary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Denver Broncos', 
    codes: ['DEN'], 
    conference: 'AFC', 
    division: 'West',
    colors: {
      primary: { hex: '#FB4F14', rgb: 'rgb(251, 79, 20)', isHiViz: true },
      secondary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Detroit Lions', 
    codes: ['DET'], 
    conference: 'NFC', 
    division: 'North',
    colors: {
      primary: { hex: '#0076B6', rgb: 'rgb(0, 118, 182)', isHiViz: true },
      secondary: { hex: '#B0B7BC', rgb: 'rgb(176, 183, 188)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Green Bay Packers', 
    codes: ['GB', 'GBP'], 
    conference: 'NFC', 
    division: 'North',
    colors: {
      primary: { hex: '#2D4A3F', rgb: 'rgb(45, 74, 63)', isHiViz: false },
      secondary: { hex: '#FFB612', rgb: 'rgb(255, 182, 18)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Houston Texans', 
    codes: ['HOU'], 
    conference: 'AFC', 
    division: 'South',
    colors: {
      primary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      secondary: { hex: '#A71930', rgb: 'rgb(167, 25, 48)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Indianapolis Colts', 
    codes: ['IND'], 
    conference: 'AFC', 
    division: 'South',
    colors: {
      primary: { hex: '#1A5BB8', rgb: 'rgb(26, 91, 184)', isHiViz: true },
      secondary: { hex: '#A2AAAD', rgb: 'rgb(162, 170, 173)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Jacksonville Jaguars', 
    codes: ['JAX', 'JAC'], 
    conference: 'AFC', 
    division: 'South',
    colors: {
      primary: { hex: '#1A8A9A', rgb: 'rgb(26, 138, 154)', isHiViz: true },
      secondary: { hex: '#9F792C', rgb: 'rgb(159, 121, 44)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Kansas City Chiefs', 
    codes: ['KC', 'KCC'], 
    conference: 'AFC', 
    division: 'West',
    colors: {
      primary: { hex: '#E31837', rgb: 'rgb(227, 24, 55)', isHiViz: true },
      secondary: { hex: '#FFB81C', rgb: 'rgb(255, 184, 28)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Las Vegas Raiders', 
    codes: ['LV', 'LVR', 'OAK'], 
    conference: 'AFC', 
    division: 'West',
    colors: {
      primary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      secondary: { hex: '#A5ACAF', rgb: 'rgb(165, 172, 175)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Los Angeles Chargers', 
    codes: ['LAC'], 
    conference: 'AFC', 
    division: 'West',
    colors: {
      primary: { hex: '#0080C6', rgb: 'rgb(0, 128, 198)', isHiViz: true },
      secondary: { hex: '#FFC20E', rgb: 'rgb(255, 194, 14)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Los Angeles Rams', 
    codes: ['LAR'], 
    conference: 'NFC', 
    division: 'West',
    colors: {
      primary: { hex: '#1A5BB8', rgb: 'rgb(26, 91, 184)', isHiViz: true },
      secondary: { hex: '#FFA300', rgb: 'rgb(255, 163, 0)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Miami Dolphins', 
    codes: ['MIA'], 
    conference: 'AFC', 
    division: 'East',
    colors: {
      primary: { hex: '#008E97', rgb: 'rgb(0, 142, 151)', isHiViz: true },
      secondary: { hex: '#FC4C02', rgb: 'rgb(252, 76, 2)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Minnesota Vikings', 
    codes: ['MIN'], 
    conference: 'NFC', 
    division: 'North',
    colors: {
      primary: { hex: '#6B3A9A', rgb: 'rgb(107, 58, 154)', isHiViz: true },
      secondary: { hex: '#FFC62F', rgb: 'rgb(255, 198, 47)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'New England Patriots', 
    codes: ['NE', 'NEP'], 
    conference: 'AFC', 
    division: 'East',
    colors: {
      primary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      secondary: { hex: '#C60C30', rgb: 'rgb(198, 12, 48)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'New Orleans Saints', 
    codes: ['NO', 'NOS'], 
    conference: 'NFC', 
    division: 'South',
    colors: {
      primary: { hex: '#D3BC8D', rgb: 'rgb(211, 188, 141)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'New York Giants', 
    codes: ['NYG'], 
    conference: 'NFC', 
    division: 'East',
    colors: {
      primary: { hex: '#1A5BB8', rgb: 'rgb(26, 91, 184)', isHiViz: true },
      secondary: { hex: '#A71930', rgb: 'rgb(167, 25, 48)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'New York Jets', 
    codes: ['NYJ'], 
    conference: 'AFC', 
    division: 'East',
    colors: {
      primary: { hex: '#2D8A6B', rgb: 'rgb(45, 138, 107)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Philadelphia Eagles', 
    codes: ['PHI'], 
    conference: 'NFC', 
    division: 'East',
    colors: {
      primary: { hex: '#1A8A9A', rgb: 'rgb(26, 138, 154)', isHiViz: true },
      secondary: { hex: '#A5ACAF', rgb: 'rgb(165, 172, 175)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Pittsburgh Steelers', 
    codes: ['PIT'], 
    conference: 'AFC', 
    division: 'North',
    colors: {
      primary: { hex: '#FFB612', rgb: 'rgb(255, 182, 18)', isHiViz: true },
      secondary: { hex: '#000000', rgb: 'rgb(0, 0, 0)', isHiViz: false },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'San Francisco 49ers', 
    codes: ['SF'], 
    conference: 'NFC', 
    division: 'West',
    colors: {
      primary: { hex: '#AA0000', rgb: 'rgb(170, 0, 0)', isHiViz: true },
      secondary: { hex: '#B3995D', rgb: 'rgb(179, 153, 93)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Seattle Seahawks', 
    codes: ['SEA'], 
    conference: 'NFC', 
    division: 'West',
    colors: {
      primary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      secondary: { hex: '#69BE28', rgb: 'rgb(105, 190, 40)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Tampa Bay Buccaneers', 
    codes: ['TB', 'TBB'], 
    conference: 'NFC', 
    division: 'South',
    colors: {
      primary: { hex: '#D50A0A', rgb: 'rgb(213, 10, 10)', isHiViz: true },
      secondary: { hex: '#FF7900', rgb: 'rgb(255, 121, 0)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Tennessee Titans', 
    codes: ['TEN'], 
    conference: 'AFC', 
    division: 'South',
    colors: {
      primary: { hex: '#1A2B4A', rgb: 'rgb(26, 43, 74)', isHiViz: false },
      secondary: { hex: '#4B92DB', rgb: 'rgb(75, 146, 219)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
  { 
    name: 'Washington Commanders', 
    codes: ['WAS', 'WSH'], 
    conference: 'NFC', 
    division: 'East',
    colors: {
      primary: { hex: '#8A1A1A', rgb: 'rgb(138, 26, 26)', isHiViz: true },
      secondary: { hex: '#FFB612', rgb: 'rgb(255, 182, 18)', isHiViz: true },
      neutral: { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', isHiViz: true }
    }
  },
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

export const getTeamColorsByCode = (code: string): TeamColors | undefined => {
  const team = getTeamByCode(code);
  return team?.colors;
};

export const getTeamColorByCode = (code: string, colorType: 'primary' | 'secondary' | 'neutral'): TeamColors[typeof colorType] | undefined => {
  const colors = getTeamColorsByCode(code);
  return colors?.[colorType];
};
