import { TeamColors } from './nflTypes';
import { getTeamByCode } from './nflTeams';

// Options for matchup color selection
export interface MatchupColorOptions {
  onlyHiViz?: boolean; // Only use high-visibility colors
}

// Interface for matchup colors
export interface MatchupColors {
  team1: {
    code: string;
    color: TeamColors['primary'] | TeamColors['secondary'] | TeamColors['neutral'];
    colorType: 'primary' | 'secondary' | 'neutral';
    strokeColor: string;
  };
  team2: {
    code: string;
    color: TeamColors['primary'] | TeamColors['secondary'] | TeamColors['neutral'];
    colorType: 'primary' | 'secondary' | 'neutral';
    strokeColor: string;
  };
}

// Utility to get non-clashing colors for a matchup
export const getMatchupColors = (teamCodes: [string, string], options?: MatchupColorOptions): MatchupColors | undefined => {
  const teams = teamCodes.map(code => getTeamByCode(code));
  if (teams.length !== 2) return undefined;
  
  const team1Colors = teams[0]?.colors;
  const team2Colors = teams[1]?.colors;
  if (!team1Colors || !team2Colors) return undefined;
  
  // Helper function to calculate color similarity (0 = identical, 1 = completely different)
  const getColorSimilarity = (color1: string, color2: string): number => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) + 
      Math.pow(rgb1.g - rgb2.g, 2) + 
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // Normalize to 0-1 scale (max distance in RGB space is ~441)
    return Math.min(distance / 441, 1);
  };
  
  // Helper function to get the best high-visibility stroke color for a team
  const getBestStrokeColor = (teamColors: TeamColors, mainColor: TeamColors['primary'] | TeamColors['secondary'] | TeamColors['neutral']): string => {
    // If the main color is already high-visibility, no stroke needed
    if (mainColor.isHiViz) return '';
    
    // Find the best high-visibility color from the team's palette (including neutral/white)
    const hiVizColors = [
      teamColors.primary,
      teamColors.secondary,
      teamColors.neutral
    ].filter(color => color.isHiViz);
    
    if (hiVizColors.length === 0) return '';
    
    // Return the first high-visibility color found
    return hiVizColors[0].hex;
  };

  // Helper function to get the best color for a team that contrasts with the other team's color
  const getBestContrastingColor = (
    teamColors: TeamColors, 
    opposingColor: string
  ): { color: TeamColors['primary'] | TeamColors['secondary'] | TeamColors['neutral'], colorType: 'primary' | 'secondary' | 'neutral' } => {
    let colorOptions = [
      { color: teamColors.primary, type: 'primary' as const },
      { color: teamColors.secondary, type: 'secondary' as const }
      // Exclude neutral (white) from main color selection
    ];
    
    // Filter to only high-visibility colors if option is set
    if (options?.onlyHiViz) {
      colorOptions = colorOptions.filter(option => option.color.isHiViz);
    }
    
    // Score each color option based on contrast and visibility
    const scoredOptions = colorOptions.map(option => {
      const similarity = getColorSimilarity(option.color.hex, opposingColor);
      const visibilityBonus = option.color.isHiViz ? 0.2 : 0;
      const score = similarity + visibilityBonus;
      
      return { ...option, score };
    });
    
    // Sort by score (highest first) and return the best option
    scoredOptions.sort((a, b) => b.score - a.score);
    return { color: scoredOptions[0].color, colorType: scoredOptions[0].type };
  };
  
  // Start with team1's primary color
  const team1Color = getBestContrastingColor(team1Colors, team2Colors.primary.hex);
  
  // Get team2's best contrasting color against team1's chosen color
  const team2Color = getBestContrastingColor(team2Colors, team1Color.color.hex);
  
  return {
    team1: {
      code: teamCodes[0],
      color: team1Color.color,
      colorType: team1Color.colorType,
      strokeColor: getBestStrokeColor(team1Colors, team1Color.color)
    },
    team2: {
      code: teamCodes[1],
      color: team2Color.color,
      colorType: team2Color.colorType,
      strokeColor: getBestStrokeColor(team2Colors, team2Color.color)
    }
  };
};

// Additional utility functions for matchup colors
export const getMatchupColorForTeam = (teamCode: string, opposingTeamCode: string, options?: MatchupColorOptions): TeamColors['primary'] | TeamColors['secondary'] | TeamColors['neutral'] | undefined => {
  const matchupColors = getMatchupColors([teamCode, opposingTeamCode], options);
  if (!matchupColors) return undefined;
  
  return matchupColors.team1.code === teamCode 
    ? matchupColors.team1.color 
    : matchupColors.team2.color;
};

export const getMatchupColorType = (teamCode: string, opposingTeamCode: string, options?: MatchupColorOptions): 'primary' | 'secondary' | 'neutral' | undefined => {
  const matchupColors = getMatchupColors([teamCode, opposingTeamCode], options);
  if (!matchupColors) return undefined;
  
  return matchupColors.team1.code === teamCode 
    ? matchupColors.team1.colorType 
    : matchupColors.team2.colorType;
};

export const getMatchupStrokeColor = (teamCode: string, opposingTeamCode: string, options?: MatchupColorOptions): string => {
  const matchupColors = getMatchupColors([teamCode, opposingTeamCode], options);
  if (!matchupColors) return '';
  
  return matchupColors.team1.code === teamCode 
    ? matchupColors.team1.strokeColor 
    : matchupColors.team2.strokeColor;
};
