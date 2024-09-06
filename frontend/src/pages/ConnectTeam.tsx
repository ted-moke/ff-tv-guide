import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import useCredentials from '../features/connect/useCredentials';
import useExternalLeagues from '../features/connect/useExternalLeagues';
import ConnectTeamForm from '../features/connect/ConnectTeamForm';
import CredentialList from '../features/connect/CredentialList';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton'; // Add this import
import Checkbox from '../components/Checkbox';
import { PlatformCredential } from '../features/platforms/platformTypes';
import { useConnectLeague } from '../features/league/useLeague';
import styles from './ConnectTeam.module.css';

const ConnectTeam: React.FC = () => {
  const navigate = useNavigate(); // Add this line
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<PlatformCredential | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: credentials, isLoading, error } = useCredentials();
  const { mutateAsync: connectLeague } = useConnectLeague();

  const handleSelectCredential = (credential: PlatformCredential) => {
    setSelectedCredential(credential);
  };

  const handleCancelNewCredential = () => {
    setShowNewCredentialForm(false);
  };

  const { data: externalLeagues, isLoading: isLoadingLeagues, error: leaguesError } = useExternalLeagues(
    selectedCredential?.id || ''
  );

  useEffect(() => {
    if (externalLeagues) {
      setSelectedLeagues(externalLeagues.map(league => league.id));
    }
  }, [externalLeagues]);

  const handleLeagueToggle = (leagueId: string) => {
    setSelectedLeagues(prevSelectedLeagues =>
      prevSelectedLeagues.includes(leagueId)
        ? prevSelectedLeagues.filter(id => id !== leagueId)
        : [...prevSelectedLeagues, leagueId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCredential && selectedLeagues.length > 0 && externalLeagues) {
      setIsConnecting(true);
      try {
        const connectPromises = selectedLeagues.map(leagueId => {
          const league = externalLeagues.find(l => l.id === leagueId);
          if (league) {
            return connectLeague({
              leagueName: league.name,
              externalLeagueId: league.id,
              platformCredentialId: selectedCredential.id,
              platformId: selectedCredential.platformId,
            });
          }
          return Promise.resolve();
        });

        await Promise.all(connectPromises);
        console.log('All leagues connected successfully');
        navigate('/');
      } catch (error) {
        console.error('Error connecting leagues:', error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsConnecting(false);
      }
    }
  };

  if (isLoading) return <div>Loading credentials...</div>;
  if (error) return <div>Error loading credentials: {(error as Error).message}</div>;

  return (
    <div className={styles.container}>
      <div>
      <h1 className={styles.title}>Connect Your Fantasy Team</h1>
      
      {!selectedCredential && !showNewCredentialForm && (
        <>
          {credentials && credentials.length > 0 && (
            <CredentialList 
              credentials={credentials as PlatformCredential[]} 
              onSelectCredential={handleSelectCredential}
            />
          )}
          <div className={styles.buttonGroup}>
            <LinkButton to="/home">
              Exit to Home
            </LinkButton>
            <Button onClick={() => setShowNewCredentialForm(true)}>
              Add New Credential
            </Button>
          </div>
        </>
      )}

      {showNewCredentialForm && (
        <ConnectTeamForm 
          onSuccess={() => setShowNewCredentialForm(false)} 
          onCancel={handleCancelNewCredential}
        />
      )}

      {selectedCredential && (
        <div>
          <h2>External Leagues</h2>
          {isLoadingLeagues && <div>Loading leagues...</div>}
          {leaguesError && <div>Error loading leagues: {(leaguesError as Error).message}</div>}
          {externalLeagues && (
            <ul>
              {externalLeagues.map(league => (
                <li key={league.id}>
                  <Checkbox
                    id={league.id}
                    checked={selectedLeagues.includes(league.id)}
                    onChange={() => handleLeagueToggle(league.id)}
                    label={league.name}
                  />
                </li>
              ))}
            </ul>
          )}
          <div className={styles.buttonGroup}>
            <LinkButton onClick={() => setSelectedCredential(null)}>
              Back
            </LinkButton>
            <Button 
              onClick={handleSubmit} 
              disabled={selectedLeagues.length === 0 || isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Selected Leagues'}
            </Button>
            {isConnecting && <div>Connecting leagues... Please wait.</div>}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ConnectTeam;