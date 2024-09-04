import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserPlatformCredentials } from '../features/connect/connectTeamAPI';
import ConnectTeamForm from '../features/connect/ConnectTeamForm';
import CredentialList from '../features/connect/CredentialList';
import Button from '../components/Button';
import { PlatformCredential } from '../features/platforms/platformTypes';
import styles from './ConnectTeam.module.css';

const ConnectTeam: React.FC = () => {
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const { data: credentials, isLoading, error } = useQuery({
    queryKey: ['userCredentials'],
    queryFn: fetchUserPlatformCredentials
  });

  const handleSelectCredential = (credential: PlatformCredential) => {
    // TODO: Implement logic for using the selected credential
    console.log('Selected credential:', credential);
  };

  const handleCancelNewCredential = () => {
    setShowNewCredentialForm(false);
  };

  if (isLoading) return <div>Loading credentials...</div>;
  if (error) return <div>Error loading credentials: {(error as Error).message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect Your Fantasy Team</h1>
      
      {!showNewCredentialForm && (
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
    </div>
  );
};

export default ConnectTeam;