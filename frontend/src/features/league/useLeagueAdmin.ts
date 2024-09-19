import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAllLeagues } from './leagueAPI';

export const useUpdateAllLeagues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAllLeagues,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};