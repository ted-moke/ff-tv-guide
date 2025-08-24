import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { fetchUserPlatformCredentials } from "./connectTeamAPI";
import { PlatformCredential } from "../platforms/platformTypes";

const useCredentials = ({ user }: { user?: User }) => {
  return useQuery<PlatformCredential[]>({
    queryKey: ["userCredentials"],
    queryFn: () => fetchUserPlatformCredentials(user),
    enabled: !!user,
  });
};

export default useCredentials;
