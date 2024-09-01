import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const fetchPlatforms = async () => {
  const idToken = localStorage.getItem("firebaseIdToken");
  const response = await fetch('http://127.0.0.1:5001/fantasy-tv-guide/us-central1/api/fantasyPlatforms', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ConnectLeague: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const { data: platforms, error, isLoading } = useQuery({
    queryKey: ['fantasyPlatforms'],
    queryFn: fetchPlatforms,
  });

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Selected platform:', selectedPlatform);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching platforms</div>;

  return (
    <div>
      <h1>Connect League</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="platform">Select Platform:</label>
        <select id="platform" value={selectedPlatform} onChange={handlePlatformChange}>
          <option value="">--Select a platform--</option>
          {platforms.map((platform: string) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
        <button type="submit">Connect</button>
      </form>
    </div>
  );
};

export default ConnectLeague;