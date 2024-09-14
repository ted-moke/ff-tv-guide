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
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Layout from "./components/ui/Layout";
import { ViewProvider } from "./features/view/ViewContext";

const queryClient = new QueryClient();

const AuthenticatedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log('user', user)

  return user ? <Layout>{element}</Layout> : <Navigate to="/splash" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={<AuthenticatedRoute element={<HomePage />} />}
      />
      <Route
        path="/connect-team"
        element={<AuthenticatedRoute element={<ConnectTeam />} />}
      />
      <Route path="/splash" element={<SplashPage />} />
      {/* catch 404 errors */}
      <Route path="*" element={<div>404: Page not found</div>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ViewProvider>
    </QueryClientProvider>
  );
};

export default App;
