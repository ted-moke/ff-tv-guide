import React, { useState, useEffect } from 'react';
import { fetchFantasyData } from '../utils/api';
import { organizePlayersByTeam } from '../utils/dataProcessing';
import TeamGrid from './TeamGrid';
import FilterControls from './FilterControls';
import { Team } from '../types';

interface Player {
  name: string;
  team: string;
}

interface Team {
  name: string;
  division: string;
  conference: string;
  players: Player[];
}

const FantasyFootballDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchFantasyData();
      const organizedTeams = organizePlayersByTeam(data);
      setTeams(organizedTeams);
    };
    loadData();
  }, []);

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
  };

  const filteredTeams = teams.filter(team => filters.length === 0 || filters.includes(team.name));

  return (
    <div>
      <h1>Fantasy Football Dashboard</h1>
      <FilterControls teams={teams} onFilterChange={handleFilterChange} />
      <TeamGrid teams={filteredTeams} />
    </div>
  );
};

export default FantasyFootballDashboard;