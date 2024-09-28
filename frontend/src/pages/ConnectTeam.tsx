import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import useCredentials from "../features/connect/useCredentials";
import useExternalLeagues from "../features/connect/useExternalLeagues";
import ConnectPlatformCredential from "../features/connect/ConnectPlatformCredential";
import CredentialManager from "../components/CredentialManager"; // Add this import
import TeamSyncer from "../components/TeamSyncer"; // Add this import
import Button from "../components/ui/Button";
import { PlatformCredential } from "../features/platforms/platformTypes";
import { useConnectLeague } from "../features/league/useLeague";
import styles from "./ConnectTeam.module.css";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuthContext } from "../features/auth/AuthProvider";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import FFTVGLogo from "../assets/FFTVGLogo";

const ConnectTeam: React.FC = () => {
  const navigate = useNavigate(); // Add this line
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<PlatformCredential | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuthContext();
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

        await new Promise((resolve) => setTimeout(resolve, 1000));
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
        <FFTVGLogo size="large" withText />
        <p className={styles.shortPitch}>
          Streamline your fantasy experience: See only what matters on game day.
        </p>
      </div>

      {!selectedCredential && !derivedShowCredentialForm && (
        <CredentialManager
          credentials={credentials as PlatformCredential[]}
          onSelectCredential={handleSelectCredential}
          setShowNewCredentialForm={setShowNewCredentialForm}
        />
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
        <TeamSyncer
          selectedCredential={selectedCredential}
          externalLeagues={externalLeagues}
          selectedLeagues={selectedLeagues}
          isLoadingLeagues={isLoadingLeagues}
          leaguesError={leaguesError}
          isConnecting={isConnecting}
          handleLeagueToggle={handleLeagueToggle}
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
          handleSubmit={handleSubmit}
          setSelectedCredential={setSelectedCredential}
        />
      )}

      {!selectedCredential && (
        <div className={styles.signInContainer}>
          <p>Already a member?</p>
          <Button outline link="/auth">
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectTeam;
