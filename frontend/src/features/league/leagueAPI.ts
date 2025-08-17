const API_URL = import.meta.env.VITE_API_URL;

export const connectLeague = async ({
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
}) => {
  const response = await fetch(`${API_URL}/leagues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      leagueName,
      externalLeagueId,
      platformCredentialId,
      externalTeamId,
      platformId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect league");
  }

  return response.json();
};

export const updateAllLeagues = async () => {
  const response = await fetch(`${API_URL}/leagues/update-all`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update leagues");
  }

  return response.json();
};

export const getLeaguesPaginated = async (
  page: number,
  limit: number,
  startAfter?: string,
  sortBy: string = "name",
  sortOrder: "asc" | "desc" = "asc"
) => {
  const url = new URL(`${API_URL}/leagues`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("sortBy", sortBy);
  url.searchParams.append("sortOrder", sortOrder);
  if (startAfter) {
    url.searchParams.append("startAfter", startAfter);
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

export interface LeagueStats {
  totalLeagues: number;
  platformCounts: { [key: string]: number };
}

export const getLeagueStats = async (): Promise<LeagueStats> => {
  const response = await fetch(`${API_URL}/leagues/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  

  if (!response.ok) {
    throw new Error("Failed to fetch league stats");
  }

  return response.json();
};

// Migration API functions
export const runMigration = async (season: number) => {
  const response = await fetch(`${API_URL}/migration/add-league-master?season=${season}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to run migration");
  }

  return response.json();
};

export const seedTestData = async () => {
  const response = await fetch(`${API_URL}/migration/seed-test-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to seed test data");
  }

  return response.json();
};
