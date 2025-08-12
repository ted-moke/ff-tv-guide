import { API_URL } from "../../config";
import type { TeamHistoryData } from "../../types/shared";

export type { TeamHistoryData };

export const getUserTeamHistory = async (userId: string): Promise<TeamHistoryData[]> => {
  const response = await fetch(`${API_URL}/user-team-history/${userId}/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch user team history:", errorText);
    throw new Error(`Failed to fetch user team history: ${errorText}`);
  }

  const data: { history: TeamHistoryData[] } = await response.json();
  return data.history;
};
