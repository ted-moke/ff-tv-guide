import React, { useState } from 'react';
import useCredentials from '../features/connect/useCredentials'; // Add this import
import useExternalLeagues from '../features/connect/useExternalLeagues'; // Add this import
import ConnectTeamForm from '../features/connect/ConnectTeamForm';
import CredentialList from '../features/connect/CredentialList';
import Button from '../components/Button';
import { PlatformCredential } from '../features/platforms/platformTypes';
import styles from './ConnectTeam.module.css';

const ConnectTeam: React.FC = () => {
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<PlatformCredential | null>(null);
  const { data: credentials, isLoading, error } = useCredentials();

  const handleSelectCredential = (credential: PlatformCredential) => {
    setSelectedCredential(credential);
  };

  const handleCancelNewCredential = () => {
    setShowNewCredentialForm(false);
  };

  const { data: externalLeagues, isLoading: isLoadingLeagues, error: leaguesError } = useExternalLeagues(
    selectedCredential?.id || ''
  );

  if (isLoading) return <div>Loading credentials...</div>;
  if (error) return <div>Error loading credentials: {(error as Error).message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect Your Fantasy Team</h1>
      
      {!selectedCredential && !showNewCredentialForm && (
        <>
          {credentials && credentials.length > 0 && (
            <CredentialList 
              credentials={credentials as PlatformCredential[]} 
              onSelectCredential={handleSelectCredential}
            />
          )}
          <Button onClick={() => setShowNewCredentialForm(true)}>
            Add New Credential
          </Button>
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
                <li key={league.id}>{league.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectTeam;