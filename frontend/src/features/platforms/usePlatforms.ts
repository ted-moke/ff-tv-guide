import { useQuery } from '@tanstack/react-query';
import { Platform } from './platformTypes';
import { fetchPlatforms } from './platformsAPI'

export const usePlatforms = () => {
  return useQuery<Platform[], Error>({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
  });
};