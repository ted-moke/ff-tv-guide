import { useQuery } from "@tanstack/react-query";
import { fetchUserPlatformCredentials } from "./connectTeamAPI";
import { PlatformCredential } from "../platforms/platformTypes";
import { AuthData } from "../auth/authTypes";

const useCredentials = ({ backendUser }: { backendUser?: AuthData | null }) => {
  return useQuery<PlatformCredential[]>({
    queryKey: ["platform-credentials"],
    queryFn: () => fetchUserPlatformCredentials(backendUser),
    enabled: !!backendUser,
  });
};

export default useCredentials;
