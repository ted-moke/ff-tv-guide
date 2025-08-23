import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SplashPage from "./pages/SplashPage";
import NotFoundPage from "./pages/NotFoundPage";
import ConnectTeam from "./pages/ConnectTeam";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLeagues from "./pages/AdminLeagues";
import PlayerShares from "./pages/PlayerShares";
import TeamHistory from "./pages/TeamHistory";
import Layout from "./components/ui/Layout";
import { ViewProvider } from "./features/view/ViewContext";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./features/auth/AuthProvider";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { AuthProvider } from "./features/auth/AuthProvider";

import "./assets/fonts/altehaasgroteskbold-webfont.woff2";
import "./assets/fonts/altehaasgroteskregular-webfont.woff2";
import UIShowcase from "./pages/UIShowcase";
import AdminDuplicateUserTeamsPage from "./pages/AdminDuplicateUserTeamsPage";
import AdminUserTeams from "./pages/AdminUserTeams";

const queryClient = new QueryClient();

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.email !== "theodore.moke@gmail.com") {
    return <Navigate to="/" replace />;
  }

  return <Layout>{element}</Layout>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ViewProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#2a2a2a",
                  border: "1px solid #121212",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  padding: "8px 16px",
                },
              }}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/connect-team"
                element={
                  <Layout isAuthBlocking={false}>
                    <ConnectTeam />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute element={<AdminDashboard />} />
                }
              >
                <Route
                  path="leagues"
                  element={<AdminLeagues />}
                />
                <Route
                  path="user-teams/duplicates"
                  element={<AdminDuplicateUserTeamsPage />}
                />
                <Route
                  path="user-teams"
                  element={<AdminUserTeams />}
                />
              </Route>
              <Route
                path="/player-shares"
                element={
                  <Layout>
                    <PlayerShares />
                  </Layout>
                }
              />
              <Route
                path="/history/teams"
                element={
                  <Layout>
                    <TeamHistory />
                  </Layout>
                }
              />
              <Route path="/splash" element={<SplashPage />} />
              <Route path="/ui/*" element={<UIShowcase />} />
              {/* catch 404 errors */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ViewProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
