import { useQuery } from "@tanstack/react-query";

export interface ExternalLeague {
  id: string;
  name: string;
  externalUserId: string;
  ownedTeam?: {
    id: string;
  };
  // Add other relevant fields
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchExternalLeagues = async (
  credentialId: string
): Promise<ExternalLeague[]> => {
  const response = await fetch(
    `${API_URL}/external-leagues?credentialId=${credentialId}&_t=${Date.now()}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.leagues || data; // Handle both new and old response formats
};

const useExternalLeagues = (credentialId: string) => {
  return useQuery({
    queryKey: ["externalLeagues", credentialId],
    queryFn: () => fetchExternalLeagues(credentialId),
    enabled: credentialId !== "",
    retry: false,
  });
};

export default useExternalLeagues;
