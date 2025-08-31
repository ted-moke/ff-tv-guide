import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import useCredentials from "../features/connect/useCredentials";
import useExternalLeagues from "../features/connect/useExternalLeagues";
import ConnectPlatformCredential from "../features/connect/ConnectPlatformCredential";
import CredentialManager from "../components/CredentialManager"; // Add this import
import TeamSyncer from "../components/TeamSyncer"; // Add this import
import { PlatformCredential } from "../features/platforms/platformTypes";
import { useConnectLeague } from "../features/league/useLeague";
import styles from "./ConnectTeam.module.css";
import { useAuthContext } from "../features/auth/AuthProvider2";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import FFTVGLogo from "../assets/FFTVGLogo";
import { useView } from "../features/view/ViewContext";
import { getCurrentSeason } from "../utils/seasonUtils";
import splashImage from "../assets/mockups-composite.png";
import mobileImageShares from "../assets/mockup-shares-single.png";
import mobileImageGuide from "../assets/mockup-guide-single.png";
import { Stack } from "../components/ui/Stack";

const ConnectTeam: React.FC = () => {
  const navigate = useNavigate(); // Add this line
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<PlatformCredential | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();
  const { backendUser } = useAuthContext();
  const {
    data: credentials,
    error: credentialsError,
    refetch: refetchCredentials,
  } = useCredentials({ backendUser });
  const { mutateAsync: connectLeague } = useConnectLeague();
  const { isMobile, selectedWeek, userTeams } = useView();

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
              season: getCurrentSeason(),
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

        if (selectedWeek === null) {
          navigate("/player-shares");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error connecting leagues:", error);
        toast.error("Error connecting leagues. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    }
  };

  if (credentialsError) {
    return (
      <div>
        Error loading credentials: {(credentialsError as Error).message}
      </div>
    );
  }

  const noUserTeams = userTeams && Object.keys(userTeams).length === 0;

  const showSplash = !selectedCredential && noUserTeams;
  const hasCredentials = credentials && credentials.length > 0;

  return (
    <div className={`${styles.connectTeamPageContainer} page-container`}>
      <div className={styles.pageHeader}>
        {!isMobile && <FFTVGLogo size="large" withText />}
      </div>

      {isMobile && showSplash && (
        <Stack gap={1} className={styles.splashTextWrapperMobile}>
          <h3>Streamline your <span>NFL and fantasy</span> viewing experience</h3>
          <ul className="list-disc">
            <li>
              <span>Stop flipping between apps</span> and websites, see who to
              watch in each NFL game
            </li>
            <li>
              Easily see <span>who playing for your opponents</span>
            </li>
            <li>
              <span>Track your ownership</span> across NFL teams and divisions
            </li>
          </ul>
        </Stack>
      )}

      {showSplash && !isMobile && (
        <div className={styles.splashImageWrapperDesktop}>
            <div className={styles.overlayText}>
              <Stack gap={1}>
                <h3><span>Streamline</span> your NFL and fantasy viewing experience</h3>
                <p>
                  If you're like us, your're sick of the sensory overload on
                  game day. It's already crazy enough to be following 8+ games
                  at a time, let alone trying to remember who you started and
                  who you're against.
                </p>
                <ul className="list-disc">
                  <li>
                    <span>Stop flipping between apps</span> and websites, see
                    who to watch in each NFL game
                  </li>
                  <li>
                    See what players <span>your opponents have</span>
                  </li>
                  <li>
                    <span>Track your ownership</span> across NFL teams and
                    divisions
                  </li>
                </ul>
              </Stack>
            </div>
          <img src={splashImage} alt="Splash Image" />
        </div>
      )}
      {!selectedCredential && hasCredentials && !showNewCredentialForm && (
        <CredentialManager
          credentials={credentials as PlatformCredential[]}
          onSelectCredential={handleSelectCredential}
          setShowNewCredentialForm={setShowNewCredentialForm}
        />
      )}

      {!selectedCredential && (!hasCredentials || showNewCredentialForm) && (
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

      {/* {!selectedCredential && !backendUser && (
        <div className={styles.signInContainer}>
          <p>Already a member?</p>
          <Button outline link="/auth">
            Sign In
          </Button>
        </div>
      )} */}

      {isMobile && showSplash && (
        <>
        <div className={`${styles.splashImageWrapper} ${styles.splashImageWrapperMobile}`}>
          <img src={mobileImageGuide} alt="Splash Image" />
        </div>
        <div className={`${styles.splashImageWrapper} ${styles.splashImageWrapperMobile}`}>
          <img src={mobileImageShares} alt="Splash Image" />
        </div>
        </>
      )}
    </div>
  );
};

export default ConnectTeam;
