import { useAuthContext } from "../auth/AuthProvider";
import { useView } from "../view/ViewContext";

export const useNeedsResources = () => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { userTeams, userTeamsLoading, userTeamsPending } = useView();

  let needsConnect = false;
  let needsAccount = false;
  let isLoading = false;

  if (isAuthLoading || userTeamsLoading || userTeamsPending) {
    isLoading = true;
  } else if (!user) {
    needsAccount = true;
  } else if (!userTeams || userTeams.length === 0) {
    needsConnect = true;
  }

  return { isLoading, needsConnect, needsAccount };
};
