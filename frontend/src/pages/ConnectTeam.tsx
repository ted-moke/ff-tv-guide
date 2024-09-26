import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import useCredentials from "../features/connect/useCredentials";
import useExternalLeagues from "../features/connect/useExternalLeagues";
import ConnectPlatformCredential from "../features/connect/ConnectPlatformCredential";
import CredentialList from "../features/connect/CredentialList";
import Button from "../components/ui/Button";
import LinkButton, { LinkButtonColor } from "../components/ui/LinkButton"; // Add this import
import Checkbox from "../components/ui/Checkbox";
import { PlatformCredential } from "../features/platforms/platformTypes";
import { useConnectLeague } from "../features/league/useLeague";
import styles from "./ConnectTeam.module.css";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../features/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Alert from "../components/ui/Alert";
import toast from "react-hot-toast";

const ConnectTeam: React.FC = () => {
  const navigate = useNavigate(); // Add this line
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<PlatformCredential | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    data: credentials,
    isLoading,
    error,
    refetch: refetchCredentials,
  } = useCredentials({ user: user ?? undefined });
  const { mutateAsync: connectLeague } = useConnectLeague();

  const handleSelectCredential = (credential: PlatformCredential) => {
    setSelectedCredential(credential);
  };

  const handleCancelNewCredential = () => {
    setShowNewCredentialForm(false);
  };

  const {
    data: externalLeagues,
    isLoading: isLoadingLeagues,
    error: leaguesError,
  } = useExternalLeagues(selectedCredential?.id || "");

  useEffect(() => {
    if (externalLeagues) {
      setSelectedLeagues(externalLeagues.map((league) => league.id));
    }
  }, [externalLeagues]);

  const handleLeagueToggle = (leagueId: string) => {
    setSelectedLeagues((prevSelectedLeagues) =>
      prevSelectedLeagues.includes(leagueId)
        ? prevSelectedLeagues.filter((id) => id !== leagueId)
        : [...prevSelectedLeagues, leagueId]
    );
  };

  const handleSelectAll = () => {
    if (externalLeagues) {
      setSelectedLeagues(externalLeagues.map((league) => league.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedLeagues([]);
  };

  const handleSubmit = async () => {
    if (selectedCredential && selectedLeagues.length > 0 && externalLeagues) {
      setIsConnecting(true);
      try {
        const connectPromises = selectedLeagues.map((leagueId) => {
          const league = externalLeagues.find((l) => l.id === leagueId);

          if (league) {
            return connectLeague({
              leagueName: league.name,
              externalLeagueId: league.id,
              platformCredentialId: selectedCredential.id,
              platformId: selectedCredential.platformId,
              externalTeamId: league.ownedTeam?.id,
            });
          }
          return Promise.resolve();
        });

        await Promise.all(connectPromises);
        queryClient.invalidateQueries({ queryKey: ["userTeams"] });
        queryClient.invalidateQueries({ queryKey: ["opponentTeams"] });
        toast.success(
          `League${
            selectedLeagues.length > 1 ? "s" : ""
          } connected successfully!`
        );
        navigate("/");
      } catch (error) {
        console.error("Error connecting leagues:", error);
        toast.error("Error connecting leagues. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    }
  };

  if (isLoading || isAuthLoading) return <LoadingSpinner />;
  if (error)
    return <div>Error loading credentials: {(error as Error).message}</div>;

  let derivedShowCredentialForm = showNewCredentialForm;
  if (!user) {
    derivedShowCredentialForm = true;
  }

  return (
    <div className={`${styles.connectTeamPageContainer} page-container`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Connect Your Fantasy League</h1>
        {!credentials || credentials.length < 1 ? (
          <Alert message="To start viewing your personalized TV Guide, you need to first connect with a fantasy platform." />
        ) : null}
      </div>
      {!selectedCredential && !derivedShowCredentialForm && (
        <div className={styles.connectTeamFormWrapper}>
          {credentials && credentials.length > 0 && (
            <div className={styles.connectTeamFormContainer}>
              <CredentialList
                credentials={credentials as PlatformCredential[]}
                onSelectCredential={handleSelectCredential}
              />
            </div>
          )}
          {credentials && credentials.length > 0 ? (
            <LinkButton
              color={LinkButtonColor.PRIMARY}
              onClick={() => setShowNewCredentialForm(true)}
            >
              + Add New Account
            </LinkButton>
          ) : (
            <>
              <p>No accounts found</p>
              <Button onClick={() => setShowNewCredentialForm(true)}>
                + Add New Account
              </Button>
            </>
          )}
        </div>
      )}

      {derivedShowCredentialForm && (
        <div className={styles.connectTeamFormWrapper}>
          <ConnectPlatformCredential
            onSuccess={async (newCredential) => {
              setSelectedCredential(newCredential);
              setShowNewCredentialForm(false);
              await refetchCredentials();
            }}
            onCancel={handleCancelNewCredential}
          />
        </div>
      )}

      {selectedCredential && (
        <div
          className={`${styles.connectTeamFormWrapper} ${styles.externalLeagueSelect}`}
        >
          {isLoadingLeagues && <LoadingSpinner />}
          {leaguesError && (
            <div>Error loading leagues: {(leaguesError as Error).message}</div>
          )}
          {externalLeagues && (
            <>
              <div className={styles.selectButtons}>
                <LinkButton onClick={handleDeselectAll}>
                  Deselect All
                </LinkButton>
                <LinkButton onClick={handleSelectAll}>Select All</LinkButton>
              </div>
              <ul className={styles.externalLeagueList}>
                {externalLeagues.map((league) => (
                  <li key={league.id}>
                    <Checkbox
                      id={league.id}
                      checked={selectedLeagues.includes(league.id)}
                      onChange={() => handleLeagueToggle(league.id)}
                      label={league.name}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className={styles.buttonGroup}>
            <LinkButton onClick={() => setSelectedCredential(null)}>
              Back
            </LinkButton>
            <Button
              onClick={handleSubmit}
              disabled={selectedLeagues.length === 0 || isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectTeam;
