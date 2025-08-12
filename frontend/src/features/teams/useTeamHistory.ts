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

  return { data, isLoading, error };
};
