import { useAuthContext } from "../auth/AuthProvider";
import { useView } from "../view/ViewContext";

export const useNeedsConnect = () => {
    const { user, isLoading: isAuthLoading } = useAuthContext();
    const { userTeams } = useView();

    let needsConnect = false;
    let isLoading = false;

    if (isAuthLoading) {
        isLoading = true;
    }
    if (!user) {
        needsConnect = true;
    }
    if (!userTeams || userTeams.length === 0) {
        needsConnect = true;
    }

    return {isLoading, needsConnect};
}