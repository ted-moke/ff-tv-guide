import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./features/auth/useAuth";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SplashPage from "./pages/SplashPage";
import ConnectTeam from "./pages/ConnectTeam"; // Add this import
import LoadingSpinner from "./components/LoadingSpinner";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const AuthenticatedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? (
    <>
      <Navigation />
      {element}
    </>
  ) : (
    <Navigate to="/" />
  );
};

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <SplashPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/home"
        element={<AuthenticatedRoute element={<HomePage />} />}
      />
      <Route
        path="/connect-team"
        element={<AuthenticatedRoute element={<ConnectTeam />} />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
