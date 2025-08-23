import { Navigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/AuthProvider";
import LoadingSpinner from "./ui/LoadingSpinner";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/connect-team" />;
  }

  return <div id="page-wrapper">{children}</div>;
};
