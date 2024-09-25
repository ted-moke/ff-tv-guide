import React from "react";
import { PlatformCredential } from "../platforms/platformTypes";
import Button, { ButtonColor } from "../../components/ui/Button";
import styles from "./CredentialList.module.css";
import logoFF from "../../assets/logo-ff.png";
import logoSleeper from "../../assets/logo-sleeper.png";

interface CredentialListProps {
  credentials: PlatformCredential[];
  onSelectCredential: (credential: PlatformCredential) => void;
}

const platformLogo = (platformId: string) => {
  switch (platformId) {
    case "fleaflicker":
      return logoFF;
    case "sleeper":
      return logoSleeper;
    default:
      return undefined;
  }
};

const CredentialList: React.FC<CredentialListProps> = ({
  credentials,
  onSelectCredential,
}) => {
  return (
    <div className={styles.credentialList}>
      {credentials.map((credential) => (
        <div key={credential.credential} className={styles.credentialItem}>
          <div className={styles.credentialContainer}>
            {platformLogo(credential.platformId) ? (
              <img
                src={platformLogo(credential.platformId)}
                width={28}
                alt={credential.platformId}
              />
            ) : (
              <p>{credential.platformId}: </p>
            )}
            <p>{credential.credential}</p>
          </div>
          <Button
            onClick={() => onSelectCredential(credential)}
            color={ButtonColor.CLEAR}
          >
            Select
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CredentialList;
