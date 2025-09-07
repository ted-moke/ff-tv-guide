import React, { useCallback, useMemo, useState } from "react";
import { OwnedPlayer, Player as PlayerType } from "../nfl/nflTypes";
import styles from "./PlayerCondensed.module.css";
import Popup from "../../components/ui/Popup";
import Button from "../../components/ui/Button";
import Chip from "../../components/ui/Chip"; // Assuming you have a Chip component
import { useView } from "../view/ViewContext"; // Import the useView hook
import { CURRENT_SEASON } from "../../constants";

interface PlayerProps {
  player: PlayerType;
  slotTypes: ("start" | "bench" | "both" | "bestBall")[];
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

const PlayerCondensed: React.FC<PlayerProps> = ({ player, slotTypes }) => {
  const { isMobile, leagueStats } = useView(); // Get isMobile from the context
  const [selectedCopy, setSelectedCopy] = useState<OwnedPlayer | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handlePopup = useCallback(
    (copy: OwnedPlayer, event: React.MouseEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setSelectedCopy(copy);
      setPopupPosition({
        x: isMobile ? window.innerWidth - 8 : rect.left,
        y: rect.bottom + 8,
      });
    },
    [selectedCopy, isMobile]
  );

  const closePopup = () => {
    setSelectedCopy(null);
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

  const currentSeasonStats = leagueStats?.[CURRENT_SEASON.toString()];

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
      <div className={styles["player-user-teams-chips"]}>
        {userCopies.map(
          (copy, index) =>
            (slotTypes.includes(copy.rosterSlotType)) && (
              <Chip
                key={`${player.name}-${copy.leagueId}-${index}`}
                label={`${copy.shortLeagueName}${copy.rosterSlotType === "bestBall" ? "*" : ""}`}
                onClick={(event: React.MouseEvent<HTMLElement>) =>
                  handlePopup(copy, event)
                }
              />
            )
        )}
      </div>
      <div
        className={`${styles["player-user-teams-chips"]} ${styles["opponent-teams"]}`}
      >
        {opponentCopies.map(
          (copy, index) =>
            (slotTypes.includes(copy.rosterSlotType)) && (
              <Chip
                key={`${player.name}-${copy.leagueId}-${index}`}
                label={`${copy.shortLeagueName}${copy.rosterSlotType === "bestBall" ? "*" : ""}`}
                variant="muted"
                onClick={(event: React.MouseEvent<HTMLElement>) =>
                  handlePopup(copy, event)
                }
              />

            )
        )}
      </div>
      {selectedCopy && popupPosition && (
        <Popup
          header={`${selectedCopy.leagueName} (${selectedCopy.shortLeagueName})`}
          content={
            <div className={styles.leaguePopup}>
              <div className={styles.leaguePopupContent}>
                <div className={styles.leaguePopupContentRow}>
                  <p className={styles.leaguePopupContentLabel}>Record</p>
                  <p className={styles.leaguePopupContentValue}>
                    {currentSeasonStats?.[selectedCopy.leagueId]?.wins}-
                    {currentSeasonStats?.[selectedCopy.leagueId]?.losses}-
                    {currentSeasonStats?.[selectedCopy.leagueId]?.ties}
                  </p>
                  <p className={styles.leaguePopupContentLabel}>
                    Avg Points For
                  </p>
                  <p className={styles.leaguePopupContentValue}>
                    {currentSeasonStats?.[selectedCopy.leagueId]?.averagePointsFor ?? "N/A"}
                  </p>
                  <p className={styles.leaguePopupContentLabel}>Points For</p>
                  <p className={styles.leaguePopupContentValue}>
                    {currentSeasonStats?.[selectedCopy.leagueId]?.pointsFor}
                  </p>
                  <p className={styles.leaguePopupContentLabel}>
                    Points Against
                  </p>
                  <p className={styles.leaguePopupContentValue}>
                    {currentSeasonStats?.[selectedCopy.leagueId]?.pointsAgainst}
                  </p>
                </div>
              </div>
              <Button
                outline
                onClick={() => window.open(externalLeagueUrl, "_blank")}
              >
                View{" "}
                <span className={styles.capitalize}>
                  {selectedCopy.platformId}
                </span>{" "}
                League
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
