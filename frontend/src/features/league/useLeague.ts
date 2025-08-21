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
      season,
    }: {
      leagueName: string;
      externalLeagueId: string;
      platformCredentialId: string;
      platformId: string;
      externalTeamId?: string;
      season: number;
    }) =>
      connectLeague({
        leagueName,
        externalLeagueId,
        platformCredentialId,
        platformId,
        externalTeamId,
        season,
      }),
  });
};
