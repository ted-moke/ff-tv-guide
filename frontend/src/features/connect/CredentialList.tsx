import React from 'react';
import { PlatformCredential } from '../platforms/platformTypes';
import Button, { ButtonColor } from '../../components/Button';
import styles from './CredentialList.module.css';

interface CredentialListProps {
  credentials: PlatformCredential[];
  onSelectCredential: (credential: PlatformCredential) => void;
}

const CredentialList: React.FC<CredentialListProps> = ({ credentials, onSelectCredential }) => {
  return (
    <div className={styles.credentialList}>
      <h2>Your Connected Accounts</h2>
      {credentials.map((credential) => (
        <div key={credential.credential} className={styles.credentialItem}>
          <span>{credential.platformId}: {credential.credential}</span>
          <Button 
            onClick={() => onSelectCredential(credential)} 
            color={ButtonColor.CLEAR}
          >
            Use This Account
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CredentialList;