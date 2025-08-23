import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";

const API_URL = import.meta.env.VITE_API_URL;

export const connectLeague = async ({
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
}) => {
  const auth = getAuth(app);
  const idToken = await auth.currentUser?.getIdToken();
  console.log("idToken", idToken);
  const response = await fetch(`${API_URL}/leagues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      leagueName,
      externalLeagueId,
      platformCredentialId,
      externalTeamId,
      platformId,
      season,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect league");
  }

  return response.json();
};



export const getLeaguesPaginated = async (
  page: number,
  limit: number,
  startAfter?: string,
  sortBy: string = "name",
  sortOrder: "asc" | "desc" = "asc",
  filters?: {
    season?: number;
    externalLeagueId?: string;
    id?: string;
    leagueMasterId?: string;
    name?: string;
    nameSearch?: string;
  }
) => {
  const url = new URL(`${API_URL}/leagues`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("sortBy", sortBy);
  url.searchParams.append("sortOrder", sortOrder);
  if (startAfter) {
    url.searchParams.append("startAfter", startAfter);
  }

  // Add filter parameters
  if (filters) {
    if (filters.season !== undefined) {
      url.searchParams.append("season", filters.season.toString());
    }
    if (filters.externalLeagueId) {
      url.searchParams.append("externalLeagueId", filters.externalLeagueId);
    }
    if (filters.id) {
      url.searchParams.append("id", filters.id);
    }
    if (filters.leagueMasterId) {
      url.searchParams.append("leagueMasterId", filters.leagueMasterId);
    }
    if (filters.name) {
      url.searchParams.append("name", filters.name);
    }
    if (filters.nameSearch) {
      url.searchParams.append("nameSearch", filters.nameSearch);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leagues");
  }

  return response.json();
};

export const syncLeague = async (leagueId: string) => {
  const response = await fetch(`${API_URL}/leagues/${leagueId}/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to sync league");
  }

  return response.json();
};


