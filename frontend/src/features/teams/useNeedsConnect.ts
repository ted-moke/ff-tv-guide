import { useAuthContext } from "../auth/AuthProvider";
import { useView } from "../view/ViewContext";

export const useNeedsConnect = () => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { userTeams, userTeamsLoading } = useView();

  let needsConnect = false;
  let isLoading = false;

  if (isAuthLoading || userTeamsLoading) {
    isLoading = true;
  } else {
    if (!user) {
      needsConnect = true;
    }
    if (!userTeams || userTeams.length === 0) {
      needsConnect = true;
    }
  }

  return { isLoading, needsConnect };
};
