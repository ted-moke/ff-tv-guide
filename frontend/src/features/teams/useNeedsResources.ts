import { useAuthContext } from "../auth/AuthProvider2";
import { useView } from "../view/ViewContext";

export const useNeedsResources = () => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { userTeams, userTeamsLoading } = useView();

  let needsConnect = false;
  let needsAccount = false;
  let isLoading = false;

  if (isAuthLoading || userTeamsLoading) {
    isLoading = true;
  } else if (!user) {
    needsAccount = true;
  } else if (!userTeams || Object.keys(userTeams).length === 0) {
    needsConnect = true;
  }

  return { isLoading, needsConnect, needsAccount };
};
