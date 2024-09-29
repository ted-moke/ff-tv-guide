import React from "react";
import CredentialList from "../features/connect/CredentialList";
import Button from "./ui/Button";
import LinkButton, { LinkButtonColor } from "./ui/LinkButton";
import { PlatformCredential } from "../features/platforms/platformTypes";
import styles from "./CredentialManager.module.css";

interface CredentialManagerProps {
  credentials: PlatformCredential[];
  onSelectCredential: (credential: PlatformCredential) => void;
  setShowNewCredentialForm: (show: boolean) => void;
}

const CredentialManager: React.FC<CredentialManagerProps> = ({
  credentials,
  onSelectCredential,
  setShowNewCredentialForm,
}) => {
  return (
    <div className={styles.connectTeamFormWrapper}>
      {credentials && credentials.length > 0 && (
        <div className={styles.connectTeamFormContainer}>
          <CredentialList
            credentials={credentials as PlatformCredential[]}
            onSelectCredential={onSelectCredential}
          />
        </div>
      )}
      {credentials && credentials.length > 0 ? (
        <LinkButton
          color={LinkButtonColor.PRIMARY}
          onClick={() => setShowNewCredentialForm(true)}
        >
          + Add Connection
        </LinkButton>
      ) : (
        <>
          <p>No accounts found</p>
          <Button onClick={() => setShowNewCredentialForm(true)}>
            + Add Connection
          </Button>
        </>
      )}
    </div>
  );
};

export default CredentialManager;