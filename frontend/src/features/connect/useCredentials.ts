import { useQuery } from "@tanstack/react-query";
import { fetchUserPlatformCredentials } from "./connectTeamAPI";
import { PlatformCredential } from "../platforms/platformTypes";
import { AuthData } from "../auth/authTypes";

const useCredentials = ({ user }: { user?: AuthData }) => {
  return useQuery<PlatformCredential[]>({
    queryKey: ["userCredentials"],
    queryFn: () => fetchUserPlatformCredentials(user),
    enabled: !!user,
  });
};

export default useCredentials;
