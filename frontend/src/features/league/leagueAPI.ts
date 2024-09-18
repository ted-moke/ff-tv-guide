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
