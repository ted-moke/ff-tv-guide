import React, { useMemo, useState } from "react";
import { OwnedPlayer, Player as PlayerType } from "../nfl/nflTypes";
import styles from "./PlayerCondensed.module.css";
import Popup from "../../components/ui/Popup";
import Button from "../../components/ui/Button";

interface PlayerProps {
  player: PlayerType;
  slotType: "start" | "bench";
}

const generateLeagueUrl = (leagueId: string, platformId: string) => {
  switch (platformId) {
    case "sleeper":
      return `https://sleeper.com/leagues/${leagueId}`;
    case "fleaflicker":
      return `https://www.fleaflicker.com/nfl/leagues/${leagueId}/scores`;
    default:
      return "";
  }
};

const PlayerCondensed: React.FC<PlayerProps> = ({ player, slotType }) => {
  const [selectedCopy, setselectedCopy] = useState<OwnedPlayer | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handlePopup = (copy: OwnedPlayer, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setselectedCopy(copy);
    setPopupPosition({ x: rect.left, y: rect.bottom });
  };

  const closePopup = () => {
    setselectedCopy(null);
    setPopupPosition(null);
  };

  if (!player) return null;

  const uniqueUserTeams = [
    ...new Set(player.copies.map((copy) => copy.leagueName)),
  ];

  const userCopies = player.copies.filter((copy) => copy.team === "self");
  const opponentCopies = player.copies.filter(
    (copy) => copy.team === "opponent"
  );

  const externalLeagueUrl = useMemo(() => {
    if (!selectedCopy) return "";
    return generateLeagueUrl(
      selectedCopy?.externalLeagueId!,
      selectedCopy?.platformId!
    );
  }, [selectedCopy]);

  return (
    <div
      key={player.name}
      className={styles.player}
      title={`${uniqueUserTeams.join("\n")}`}
    >
      <p className={`${styles["player-position"]} ${styles[player.position]}`}>
        {player.position}
      </p>
      <p
        className={`${styles["player-name"]} ${
          userCopies.length <= 0 && styles["player-name-opponent-only"]
        }`}
      >
        {player.name}
      </p>
      <div className={styles["player-user-teams-text"]}>
        {userCopies.map(
          (copy, index) =>
            copy.rosterSlotType === slotType && (
              <p
                key={`${player.name}-${copy.leagueId}-${index}`}
                onClick={(event) => handlePopup(copy, event)}
              >
                {copy.shortLeagueName}
              </p>
            )
        )}
      </div>
      <div
        className={`${styles["player-user-teams-text"]} ${styles["opponent-teams"]}`}
      >
        {opponentCopies.map(
          (copy, index) =>
            copy.rosterSlotType === slotType && (
              <p
                key={`${player.name}-${copy.leagueId}-${index}`}
                onClick={(event) => handlePopup(copy, event)}
              >
                {copy.shortLeagueName}
              </p>
            )
        )}
      </div>
      {selectedCopy && popupPosition && (
        <Popup
          content={
            <div className={styles.leaguePopup}>
                <h5>{selectedCopy.leagueName}</h5>
              <div className={styles.leaguePopupContent}>
                <p>Code: {selectedCopy.shortLeagueName}</p>
                <p className={styles.platformId}>Platform: {selectedCopy.platformId}</p>
              </div>
              <Button onClick={() => window.open(externalLeagueUrl, "_blank")}>
                View League
              </Button>
            </div>
          }
          position={popupPosition}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default PlayerCondensed;
