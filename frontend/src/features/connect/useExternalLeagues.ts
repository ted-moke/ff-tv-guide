import { useQuery } from "@tanstack/react-query";

interface ExternalLeague {
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
    `${API_URL}/external-leagues?credentialId=${credentialId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
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
