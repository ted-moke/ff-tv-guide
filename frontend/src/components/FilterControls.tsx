import React from 'react';
import { Team } from '../types';

interface FilterControlsProps {
  teams: Team[];
  onFilterChange: (filters: string[]) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ teams, onFilterChange }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const teamName = event.target.value;
    const isChecked = event.target.checked;

    onFilterChange(prevFilters => {
      if (isChecked) {
        return [...prevFilters, teamName];
      } else {
        return prevFilters.filter(filter => filter !== teamName);
      }
    });
  };

  return (
    <div className="filter-controls">
      <h3>Filter Teams</h3>
      {teams.map(team => (
        <label key={team.name}>
          <input
            type="checkbox"
            value={team.name}
            onChange={handleCheckboxChange}
          />
          {team.name}
        </label>
      ))}
    </div>
  );
};

export default FilterControls;