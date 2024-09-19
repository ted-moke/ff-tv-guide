import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateAllLeagues } from '../features/league/leagueAPI';
import Button from '../components/ui/Button';
import LeagueList from '../features/league/LeagueList';

const AdminDashboard: React.FC = () => {
  const mutation = useMutation({
    mutationFn: updateAllLeagues,
    onSuccess: () => {
      alert('All leagues updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update leagues:', error);
      alert('Failed to update leagues');
    },
  });

  const handleUpdateAllLeagues = () => {
    mutation.mutate();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Button onClick={handleUpdateAllLeagues} disabled={mutation.isPending}>
        {mutation.isPending ? 'Updating...' : 'Update All Leagues'}
      </Button>
      <LeagueList />
    </div>
  );
};

export default AdminDashboard;