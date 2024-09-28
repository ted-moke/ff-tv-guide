import React from "react";
import Checkbox from "../components/ui/Checkbox";
import Button from "../components/ui/Button";
import LinkButton from "../components/ui/LinkButton";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { PlatformCredential } from "../features/platforms/platformTypes";
import styles from "./TeamSyncer.module.css";
import { ExternalLeague } from "../features/connect/useExternalLeagues";
import SleeperLogo from "../assets/logo-sleeper.png";
import FFLogo from "../assets/logo-ff.png";

interface TeamSyncerProps {
  selectedCredential: PlatformCredential | null;
  externalLeagues?: ExternalLeague[];
  selectedLeagues: string[];
  isLoadingLeagues: boolean;
  leaguesError: Error | null;
  isConnecting: boolean;
  handleLeagueToggle: (leagueId: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleSubmit: () => void;
  setSelectedCredential: (credential: PlatformCredential | null) => void;
}

const platformIcons = {
  sleeper: SleeperLogo,
  ff: FFLogo,
};

const TeamSyncer: React.FC<TeamSyncerProps> = ({
  selectedCredential,
  externalLeagues,
  selectedLeagues,
  isLoadingLeagues,
  leaguesError,
  isConnecting,
  handleLeagueToggle,
  handleSelectAll,
  handleDeselectAll,
  handleSubmit,
  setSelectedCredential,
}) => {
  return (
    <div
      className={`${styles.connectTeamFormWrapper} ${styles.externalLeagueSelect}`}
    >
      {isLoadingLeagues && <LoadingSpinner />}
      {leaguesError && (
        <div>Error loading leagues: {(leaguesError as Error).message}</div>
      )}
      {externalLeagues && (
        <>
          <div className={styles.contentHeader}>
            <img
              src={
                platformIcons[
                  selectedCredential?.platformId as keyof typeof platformIcons
                ]
              }
              width={30}
              alt={selectedCredential?.platformId}
            />
            <h4>Select Leagues</h4>
          </div>
          <div className={styles.selectButtons}>
            <LinkButton onClick={handleDeselectAll}>Deselect All</LinkButton>
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
  );
};

export default TeamSyncer;
