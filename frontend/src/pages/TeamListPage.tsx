import React from 'react';
import { useUserTeams, useOpponentTeams } from '../features/teams/useUserTeams';

const TeamListPage: React.FC = () => {
  const { data: userTeams, isLoading: isLoadingUserTeams, error: userTeamsError } = useUserTeams();
  const { data: opponentTeams, isLoading: isLoadingOpponentTeams, error: opponentTeamsError } = useOpponentTeams();

  if (isLoadingUserTeams || isLoadingOpponentTeams) return <div>Loading...</div>;
  if (userTeamsError || opponentTeamsError) return <div>Error: {userTeamsError?.message || opponentTeamsError?.message}</div>;

  return (
    <div>
      <h2>User Teams</h2>
      {userTeams?.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <p>League: {team.leagueName}</p>
        </div>
      ))}
      <h2>Opponent Teams</h2>
      {opponentTeams?.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <p>League: {team.leagueName}</p>
        </div>
      ))}
    </div>
  );
};

export default TeamListPage; 