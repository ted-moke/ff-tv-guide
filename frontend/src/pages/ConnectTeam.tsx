import React, { useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { usePlatforms } from '../features/platforms/usePlatforms';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Dropdown from '../components/Dropdown';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './ConnectTeam.module.css';

const ConnectTeam: React.FC = () => {
  const { user } = useAuth();
  const { data: platforms, isLoading, error } = usePlatforms();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [credential, setCredential] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the logic to connect the team
    console.log('Connecting team with:', { selectedPlatform, credential });
  };

  if (!user) {
    return <div className={styles.message}>Please log in to connect your team.</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.message}>Error loading platforms: {error.message}</div>;
  }

  const selectedPlatformObj = platforms?.find((p) => p.id === selectedPlatform);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Connect Your Fantasy Team</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Dropdown
            id="platform"
            label="Select Platform"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            options={platforms?.map(platform => ({ value: platform.id, label: platform.name })) || []}
            placeholder="Select a platform"
            required
            className={styles.select}
          />
          {selectedPlatformObj && (
            <TextInput
              id="credential"
              label={selectedPlatformObj.credentialType === 'email' ? 'Email' : 'Username'}
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder={selectedPlatformObj.credentialType === 'email' ? 'Enter your email' : 'Enter your username'}
              required
              className={styles.input}
            />
          )}
          <Button type="submit" className={styles.button}>Connect Team</Button>
        </form>
      </div>
    </div>
  );
};

export default ConnectTeam;