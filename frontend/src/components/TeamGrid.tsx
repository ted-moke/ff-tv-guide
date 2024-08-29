import React from 'react';
import { Team } from '../types';

interface TeamGridProps {
  teams: Team[];
}

const TeamGrid: React.FC<TeamGridProps> = ({ teams }) => {
  const groupedTeams = teams.reduce((acc, team) => {
    if (!acc[team.conference]) {
      acc[team.conference] = {};
    }
    if (!acc[team.conference][team.division]) {
      acc[team.conference][team.division] = [];
    }
    acc[team.conference][team.division].push(team);
    return acc;
  }, {} as Record<string, Record<string, Team[]>>);

  return (
    <div className="team-grid">
      {Object.entries(groupedTeams).map(([conference, divisions]) => (
        <div key={conference} className="conference">
          <h2>{conference}</h2>
          {Object.entries(divisions).map(([division, divisionTeams]) => (
            <div key={division} className="division">
              <h3>{division}</h3>
              <div className="teams">
                {divisionTeams.map(team => (
                  <div key={team.name} className="team">
                    <h4>{team.name}</h4>
                    <ul>
                      {team.players.map(player => (
                        <li key={player.name}>{player.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TeamGrid;