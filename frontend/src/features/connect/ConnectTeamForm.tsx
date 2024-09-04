import React, { useState } from 'react';
import { usePlatforms } from '../platforms/usePlatforms';
import { Platform } from '../platforms/platformTypes';
import Dropdown from '../../components/Dropdown';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import styles from './ConnectTeamForm.module.css';

const ConnectTeamForm: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { data, isLoading, error } = usePlatforms();

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const platform = data?.find(p => p.id === event.target.value) || null;
    setSelectedPlatform(platform);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Selected platform:', selectedPlatform);
    console.log('Email:', email);
    console.log('Username:', username);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching platforms: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Dropdown
        id="platform"
        label="Select Platform:"
        value={selectedPlatform?.id || ''}
        onChange={handlePlatformChange}
        options={data ? data.map(platform => ({ value: platform.id, label: platform.name })) : []}
        placeholder="--Select a platform--"
        required
      />

      {selectedPlatform && (
        <>
          {selectedPlatform.credentialType === 'email' && (
            <TextInput
              type="email"
              id="email"
              label="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          {selectedPlatform.credentialType === 'username' && (
            <TextInput
              type="text"
              id="username"
              label="Username:"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
        </>
      )}

      <Button type="submit" disabled={!selectedPlatform}>
        Connect
      </Button>
    </form>
  );
};

export default ConnectTeamForm;