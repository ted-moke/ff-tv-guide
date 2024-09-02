import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConnectLeague from './components/ConnectLeague';
import AIChatHistory from './components/Ref';
import SplashPage from './components/SplashPage';
import Login from './components/Login';
import RegisterPage from './components/RegisterPage'; // Import the Register component
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from './firebaseConfig'; // Ensure this import is at the top

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth(app); // Use the initialized app
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/connect-league" element={isAuthenticated ? <ConnectLeague /> : <Navigate to="/splash" />} />
          <Route path="/" element={isAuthenticated ? <AIChatHistory /> : <Navigate to="/splash" />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Add the register route */}
          {/* Add other routes here */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
