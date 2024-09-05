import { useMutation } from '@tanstack/react-query';
import { connectLeague } from './leagueAPI';

export const useConnectLeague = () => {
  return useMutation({
    mutationFn: ({ leagueName, externalLeagueId, platformCredentialId, platformId}: { leagueName: string, externalLeagueId: string, platformCredentialId: string, platformId: string }) => 
      connectLeague(leagueName, externalLeagueId, platformCredentialId, platformId),
  });
};