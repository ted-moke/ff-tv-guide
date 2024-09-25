import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlatforms } from "../platforms/usePlatforms";
import { Platform, PlatformCredential } from "../platforms/platformTypes";
import { createPlatformCredential } from "./connectTeamAPI";
import { useAuth } from "../auth/useAuth";
import Dropdown from "../../components/ui/Dropdown";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import LinkButton from "../../components/ui/LinkButton";
import styles from "./ConnectPlatformCredential.module.css";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface ConnectPlatformCredentialProps {
  onSuccess: (newCredential: PlatformCredential) => void;
  onCancel: () => void;
}

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
  const { user, registerTemporaryUser } = useAuth();
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

  const handlePlatformChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const platform =
      platforms?.find((p) => p.id === event.target.value) || null;
    setSelectedPlatform(platform);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("handleSubmit called");
    setIsWorking(true);
    try {
      event.preventDefault();

      let currentUser = user;

      if (!user) {
        currentUser = await registerTemporaryUser();
      }

      if (selectedPlatform && currentUser?.uid) {
        console.log("selectedPlatform", selectedPlatform);
        mutation.mutateAsync({
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <Dropdown
        id="platform"
        label="Select Platform:"
        value={selectedPlatform?.id || ""}
        onChange={handlePlatformChange}
        options={
          platforms
            ? platforms.map((platform) => ({
                value: platform.id,
                label: platform.name,
              }))
            : []
        }
        placeholder="--Select a platform--"
        required
      />

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
