import { useMutation } from "@tanstack/react-query";
import { connectLeague } from "./leagueAPI";

export const useConnectLeague = () => {
  return useMutation({
    mutationFn: ({
      leagueName,
      externalLeagueId,
      platformCredentialId,
      platformId,
      externalTeamId,
    }: {
      leagueName: string;
      externalLeagueId: string;
      platformCredentialId: string;
      platformId: string;
      externalTeamId?: string;
    }) =>
      connectLeague({
        leagueName,
        externalLeagueId,
        platformCredentialId,
        platformId,
        externalTeamId,
      }),
  });
};
