import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../auth/AuthProvider2"; 
import { FantasyTeam } from "./teamTypes";
import { API_URL } from "../../config";
import { CURRENT_SEASON } from "../../constants";
import { UserTeams } from "../view/ViewContext";

const updateStaleTeams = async (teams: FantasyTeam[], queryClient: any) => {
  const teamsToUpdate = teams.filter((team) => team.needsUpdate);
  let ids = teamsToUpdate.map((team) => team.leagueId);

  if (ids.length > 0) {
    try {
      await fetch(`${API_URL}/leagues/update-by-ids`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, idType: "internal" }),
      });

      // Invalidate queries after update
      queryClient.invalidateQueries({ queryKey: ["userTeams"] });
      queryClient.invalidateQueries({ queryKey: ["opponentTeams"] });

      console.log("teams updated");
    } catch (error) {
      console.error("Error updating leagues by IDs:", error);
    }
  }
};

export const useUserTeams = ({
  seasonStart = CURRENT_SEASON,
  seasonEnd = null,
}: {
  seasonStart?: number | null;
  seasonEnd?: number | null;
} = {}) => {
  const { backendUser, user, isLoading: isAuthLoading } = useAuthContext();
  const queryClient = useQueryClient();

  let hasTeamsToUpdate = false;
  let hasTeamsToMigrate = false;

  const { data, isLoading, isPending, error } = useQuery<{
    teamsBySeason: Record<number, FantasyTeam[]>;
    teamsNeedingUpdate: FantasyTeam[];
    teamsNeedingMigrate: FantasyTeam[];
  }>({
    queryKey: ["userTeams", backendUser?.uid],
    queryFn: async (): Promise<{
      teamsBySeason: Record<number, FantasyTeam[]>;
      teamsNeedingUpdate: FantasyTeam[];
      teamsNeedingMigrate: FantasyTeam[];
    }> => {
      try {
        if (!backendUser) throw new Error("User not authenticated");

        const idToken = await user?.getIdToken();

        const response = await fetch(
          `${API_URL}/users/${backendUser.uid}/teams?seasonStart=${seasonStart}&seasonEnd=${seasonEnd}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user teams:", errorText);
          throw new Error(`Failed to fetch user teams: ${errorText}`);
        }

        const data: {
          teamsBySeason: Record<number, FantasyTeam[]>;
          teamsNeedingUpdate: FantasyTeam[];
          teamsNeedingMigrate: FantasyTeam[];
        } = await response.json();
        const teamsBySeason = data.teamsBySeason;
        const teamsNeedingUpdate = data.teamsNeedingUpdate;
        const teamsNeedingMigrate = data.teamsNeedingMigrate;

        hasTeamsToUpdate = teamsNeedingUpdate.length > 0;
        hasTeamsToMigrate = teamsNeedingMigrate.length > 0;

        // Call the abstracted updateStaleTeams function
        updateStaleTeams(teamsNeedingUpdate, queryClient);

        // // Migrate teams
        // await updateStaleTeams(teamsNeedingMigrate, queryClient);

        // Might not need to return teams needing update and migrate
        return { teamsBySeason, teamsNeedingUpdate, teamsNeedingMigrate };
      } catch (error) {
        console.error("Error fetching user teams:", error);
        throw error;
      }
    },
    enabled: !!backendUser, // Only run the query if there's a user
  });

  const { teamsBySeason } = data || {};

  let teamMap: UserTeams = {};
  if (teamsBySeason) {
    for (let [season, teams] of Object.entries(teamsBySeason)) {
      teamMap[season] = teams.reduce((acc, team) => {
        acc[team.leagueId] = team;
        return acc;
      }, {} as Record<string, FantasyTeam>);
    }
  }

  return {
    data,
    isLoading: isAuthLoading || isLoading,
    isPending,
    error,
    teamMap,
    hasTeamsToUpdate,
    hasTeamsToMigrate,
  };
};

export const useOpponentTeams = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { backendUser, user } = useAuthContext();

  return useQuery<FantasyTeam[]>({
    queryKey: ["opponentTeams", backendUser?.uid],
    queryFn: async (): Promise<FantasyTeam[]> => {
      if (!backendUser) throw new Error("User not authenticated");
      const idToken = await user?.getIdToken();
      const response = await fetch(`${API_URL}/users/${backendUser.uid}/opponents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch opponent teams:", errorText);
        throw new Error(`Failed to fetch opponent teams: ${errorText}`);
      }
      const data = await response.json();
      return data.opponents;
    },
    enabled: enabled && !!user, // Only run the query if there's a user
  });
};
