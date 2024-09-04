import { useQuery } from '@tanstack/react-query';
import { fetchUserPlatformCredentials } from './connectTeamAPI';
import { PlatformCredential } from '../platforms/platformTypes';

const useCredentials = () => {
  return useQuery<PlatformCredential[]>({
    queryKey: ['userCredentials'],
    queryFn: fetchUserPlatformCredentials
  });
};

export default useCredentials;