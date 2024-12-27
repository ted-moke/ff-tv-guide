import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../auth/AuthProvider"; // Assuming you have an auth context
import { FantasyTeam } from "./teamTypes";
const API_URL = import.meta.env.VITE_API_URL;

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
    } catch (error) {
      console.error("Error updating leagues by IDs:", error);
    }
  }
};

export const useUserTeams = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FantasyTeam[]>({
    queryKey: ["userTeams", user?.uid],
    queryFn: async (): Promise<FantasyTeam[]> => {
      try {
        if (!user) throw new Error("User not authenticated");

        const response = await fetch(`${API_URL}/users/${user.uid}/teams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user teams:", errorText);
          throw new Error(`Failed to fetch user teams: ${errorText}`);
        }

        const data: { teams: FantasyTeam[] } = await response.json();
        const teams = data.teams;

        // Call the abstracted updateStaleTeams function
        await updateStaleTeams(teams, queryClient);

        return teams;
      } catch (error) {
        console.error("Error fetching user teams:", error);
        throw error;
      }
    },
    enabled: !!user, // Only run the query if there's a user
  });

  const teamMap = useMemo(() => {
    return data?.reduce((acc, team) => {
      acc[team.leagueId] = team;
      return acc;
    }, {} as Record<string, FantasyTeam>);
  }, [data]);

  return { data, isLoading, error, teamMap };
};

export const useOpponentTeams = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { user } = useAuthContext();

  return useQuery<FantasyTeam[]>({
    queryKey: ["opponentTeams", user?.uid],
    queryFn: async (): Promise<FantasyTeam[]> => {
      if (!user) throw new Error("User not authenticated");
      const response = await fetch(`${API_URL}/users/${user.uid}/opponents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
