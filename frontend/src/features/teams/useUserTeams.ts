import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth'; // Assuming you have an auth context
import { FantasyTeam } from './teamTypes';
const API_URL = import.meta.env.VITE_API_URL;


const useUserTeams = () => {
  const { user } = useAuth();

  return useQuery<FantasyTeam[]>({
    queryKey: ['userTeams', user?.uid],
    queryFn: async (): Promise<FantasyTeam[]> => {
      if (!user) throw new Error('User not authenticated');
      const response = await fetch(`${API_URL}/users/${user.uid}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch user teams:', errorText);
        throw new Error(`Failed to fetch user teams: ${errorText}`);
      }
      const data = await response.json();
      return data.teams;
    },
    enabled: !!user, // Only run the query if there's a user
  });
};

export default useUserTeams;