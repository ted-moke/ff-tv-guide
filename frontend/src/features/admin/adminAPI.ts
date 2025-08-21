const API_URL = import.meta.env.VITE_API_URL;

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

export const runSingleLeagueMigration = async (leagueId: string, season: number) => {
  const response = await fetch(`${API_URL}/migration/single-league?leagueId=${leagueId}&season=${season}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to run single league migration");
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
