import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConnectLeague from './components/ConnectLeague';
import AIChatHistory from './components/Ref';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/connect-league" element={<ConnectLeague />} />
          <Route path="/" element={<AIChatHistory />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
