import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlatforms } from "../platforms/usePlatforms";
import { Platform, PlatformCredential } from "../platforms/platformTypes";
import { createPlatformCredential } from "./connectTeamAPI";
import { useAuthContext } from "../auth/AuthProvider";

import RadioButton from "../../components/ui/RadioButton";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import LinkButton from "../../components/ui/LinkButton";
import styles from "./ConnectPlatformCredential.module.css";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import logoFF from "../../assets/logo-ff.png";
import logoSleeper from "../../assets/logo-sleeper.png";

interface ConnectPlatformCredentialProps {
  onSuccess: (newCredential: PlatformCredential) => void;
  onCancel: () => void;
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

const ConnectPlatformCredential: React.FC<ConnectPlatformCredentialProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isWorking, setIsWorking] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [credential, setCredential] = useState("");
  const { data: platforms, isLoading, error } = usePlatforms();
  const { user, registerTemporaryUser } = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPlatformCredential,
    onSuccess: (newCredential) => {
      queryClient.invalidateQueries({ queryKey: ["userCredentials"] });
      setSelectedPlatform(null);
      setCredential("");

      console.log("onSuccess called", newCredential);
      onSuccess(newCredential);
    },
    onError: (error) => {
      console.error("Failed to create platform credential:", error);
    },
  });

  const handlePlatformChange = (platformId: string) => {
    const platform = platforms?.find((p) => p.id === platformId);
    setSelectedPlatform(platform || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsWorking(true);
    try {
      let currentUser = user;

      if (!user) {
        currentUser = await registerTemporaryUser();
      }

      if (selectedPlatform && currentUser?.uid) {
        await mutation.mutateAsync({
          platformId: selectedPlatform.id,
          userId: currentUser.uid,
          credential: credential,
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsWorking(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div>Error fetching platforms: {(error as Error).message}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h4>Choose a Platform</h4>
      <div className={styles.platformOptions}>
        {platforms?.map((platform) => (
          <div key={platform.id} className={styles.platformOption}>
            <RadioButton
              id={`platform-${platform.id}`}
              name="platform"
              value={platform.id}
              checked={selectedPlatform?.id === platform.id}
              onChange={() => handlePlatformChange(platform.id)}
              labelContent={
                <div className={styles.platformLabel}>
                  <img
                    src={platformLogo(platform.id)}
                    alt={platform.name}
                    width={32}
                  />
                  <p>{platform.name}</p>
                </div>
              }
            />
          </div>
        ))}
      </div>
      {selectedPlatform && (
        <TextInput
          type={selectedPlatform.credentialType === "email" ? "email" : "text"}
          id="credential"
          label={
            selectedPlatform.credentialType === "email" ? "Email:" : "Username:"
          }
          value={credential}
          placeholder={
            selectedPlatform.credentialType === "email" ? "Email" : "Username"
          }
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      )}

      <div className={styles.buttonGroup}>
        <LinkButton type="button" onClick={onCancel}>
          Cancel
        </LinkButton>
        <Button
          type="submit"
          disabled={!selectedPlatform || mutation.isPending || isWorking}
        >
          {mutation.isPending || isWorking ? "Connecting..." : "Connect"}
        </Button>
      </div>

      {mutation.isError && (
        <p className={styles.error}>
          Error: {(mutation.error as Error).message}
        </p>
      )}
      {mutation.isSuccess && (
        <p className={styles.success}>Platform connected successfully!</p>
      )}
    </form>
  );
};

export default ConnectPlatformCredential;
