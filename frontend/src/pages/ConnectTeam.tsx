import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import useCredentials from "../features/connect/useCredentials";
import useExternalLeagues from "../features/connect/useExternalLeagues";
import ConnectTeamForm from "../features/connect/ConnectTeamForm";
import CredentialList from "../features/connect/CredentialList";
import Button from "../components/ui/Button";
import LinkButton, { LinkButtonColor } from "../components/ui/LinkButton"; // Add this import
import Checkbox from "../components/ui/Checkbox";
import { PlatformCredential } from "../features/platforms/platformTypes";
import { useConnectLeague } from "../features/league/useLeague";
import styles from "./ConnectTeam.module.css";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ConnectTeam: React.FC = () => {
  const navigate = useNavigate(); // Add this line
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<PlatformCredential | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: credentials, isLoading, error } = useCredentials();
  const { mutateAsync: connectLeague } = useConnectLeague();

  const manuallyFilteredCredentials = credentials;
  // const manuallyFilteredCredentials = credentials?.filter(
  //   (credential) => credential.platformId !== "fleaflicker"
  // );

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
          console.log("league", league);

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
        console.log("All leagues connected successfully");
        navigate("/");
      } catch (error) {
        console.error("Error connecting leagues:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsConnecting(false);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div>Error loading credentials: {(error as Error).message}</div>;

  return (
    <div className={`${styles.connectTeamPageContainer} page-container`}>
      <div>
        <h1 className={styles.title}>Connect Your Fantasy League</h1>
        <p>
          To connect your league, you need to provide a credential (e.g. email
          OR username) for the platform you are using.
        </p>
        {!selectedCredential && !showNewCredentialForm && (
          <div className={styles.connectTeamFormWrapper}>
            {manuallyFilteredCredentials &&
              manuallyFilteredCredentials.length > 0 && (
                <div className={styles.connectTeamFormContainer}>
                  <CredentialList
                    credentials={
                      manuallyFilteredCredentials as PlatformCredential[]
                    }
                    onSelectCredential={handleSelectCredential}
                  />
                </div>
              )}
            <LinkButton
              color={LinkButtonColor.PRIMARY}
              onClick={() => setShowNewCredentialForm(true)}
            >
              + Add New Credential
            </LinkButton>
          </div>
        )}

        {showNewCredentialForm && (
          <ConnectTeamForm
            onSuccess={() => setShowNewCredentialForm(false)}
            onCancel={handleCancelNewCredential}
          />
        )}

        {selectedCredential && (
          <div
            className={`${styles.connectTeamFormWrapper} ${styles.externalLeagueSelect}`}
          >
            {isLoadingLeagues && <div>Loading leagues...</div>}
            {leaguesError && (
              <div>
                Error loading leagues: {(leaguesError as Error).message}
              </div>
            )}
            {externalLeagues && (
              <>
                <div className={styles.selectButtons}>
                  <LinkButton onClick={handleDeselectAll}>
                    Deselect All
                  </LinkButton>
                  <LinkButton onClick={handleSelectAll}>Select All</LinkButton>
                </div>
                <ul>
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
                {isConnecting ? "Connecting..." : "Connect Selected Leagues"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectTeam;
