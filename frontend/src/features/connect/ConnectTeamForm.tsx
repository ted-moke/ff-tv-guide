import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePlatforms } from '../platforms/usePlatforms';
import { Platform } from '../platforms/platformTypes';
import { createPlatformCredential } from './connectTeamAPI';
import { useAuth } from '../auth/useAuth';
import Dropdown from '../../components/ui/Dropdown';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import LinkButton from '../../components/ui/LinkButton';
import styles from './ConnectTeamForm.module.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ConnectTeamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ConnectTeamForm: React.FC<ConnectTeamFormProps> = ({ onSuccess, onCancel }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [credential, setCredential] = useState('');
  const { data: platforms, isLoading, error } = usePlatforms();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const manuallyFilteredPlatforms = platforms?.filter(
    (platform) => platform.id !== "fleaflicker"
  );

  const mutation = useMutation({
    mutationFn: createPlatformCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCredentials'] });
      setSelectedPlatform(null);
      setCredential('');
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to create platform credential:', error);
    },
  });

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const platform = platforms?.find(p => p.id === event.target.value) || null;
    setSelectedPlatform(platform);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedPlatform && user?.uid) {
      mutation.mutate({
        platformId: selectedPlatform.id,
        userId: user.uid,
        credential: credential,
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error fetching platforms: {(error as Error).message}</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Dropdown
        id="platform"
        label="Select Platform:"
        value={selectedPlatform?.id || ''}
        onChange={handlePlatformChange}
        options={manuallyFilteredPlatforms ? manuallyFilteredPlatforms.map(platform => ({ value: platform.id, label: platform.name })) : []}
        placeholder="--Select a platform--"
        required
      />

      {selectedPlatform && (
        <TextInput
          type={selectedPlatform.credentialType === 'email' ? 'email' : 'text'}
          id="credential"
          label={selectedPlatform.credentialType === 'email' ? 'Email:' : 'Username:'}
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      )}

      <div className={styles.buttonGroup}>
        <LinkButton onClick={onCancel}>Cancel</LinkButton>
        <Button type="submit" disabled={!selectedPlatform || mutation.isPending}>
          {mutation.isPending ? 'Connecting...' : 'Connect'}
        </Button>
      </div>

      {mutation.isError && <p className={styles.error}>Error: {(mutation.error as Error).message}</p>}
      {mutation.isSuccess && <p className={styles.success}>Platform connected successfully!</p>}
    </form>
  );
};

export default ConnectTeamForm;