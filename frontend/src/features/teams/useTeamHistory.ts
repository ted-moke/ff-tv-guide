import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../auth/AuthProvider";
import { getUserTeamHistory } from "./teamHistoryAPI";
import type { TeamHistoryData } from "../../types/shared";

export const useTeamHistory = () => {
  const { user } = useAuthContext();

  const { data, isLoading, error } = useQuery<TeamHistoryData[]>({
    queryKey: ["teamHistory", user?.uid],
    queryFn: async (): Promise<TeamHistoryData[]> => {
      if (!user?.uid) throw new Error("User not authenticated");
      return getUserTeamHistory(user.uid);
    },
    enabled: !!user,
  });

  let groupedByTeam: { [key: string]: TeamHistoryData[] } = {};
  let noLeagueMasterId: TeamHistoryData[] = [];
  if (data) {
    data.forEach((team) => {
      if (!team.leagueMaster.id) {
        noLeagueMasterId.push(team);
        return;
      }
      if (!groupedByTeam[team.leagueMaster.id]) {
        groupedByTeam[team.leagueMaster.id] = [];
      }
      groupedByTeam[team.leagueMaster.id].push(team);
    });
  }

  return { data, groupedByTeam, isLoading, error };
};
