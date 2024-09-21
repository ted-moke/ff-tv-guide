import React, { useState, useEffect, useRef } from "react";
import { Player as PlayerType } from "../nfl/nflTypes";
import styles from "./PlayerCondensed.module.css";
import IconButton from "../../components/IconButton";
import { LuX as CloseIcon } from "react-icons/lu" // Example icon import

interface PlayerProps {
  player: PlayerType;
  slotType: "start" | "bench";
}

const PlayerCondensed: React.FC<PlayerProps> = ({ player, slotType }) => {
  const [popupContent, setPopupContent] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handlePopup = (leagueName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupContent(leagueName);
    setPopupPosition({ x: rect.left, y: rect.bottom });
  };

  const closePopup = () => {
    setPopupContent(null);
    setPopupPosition(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    if (popupContent) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupContent]);

  if (!player) return null;

  const uniqueUserTeams = [
    ...new Set(player.copies.map((copy) => copy.leagueName)),
  ];

  const userCopies = player.copies.filter((copy) => copy.team === "self");
  const opponentCopies = player.copies.filter(
    (copy) => copy.team === "opponent"
  );

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
              <p key={`${player.name}-${copy.leagueId}-${index}`} onClick={(event) => handlePopup(copy.leagueName, event)}>
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
              <p key={`${player.name}-${copy.leagueId}-${index}`} onClick={(event) => handlePopup(copy.leagueName, event)}>
              {copy.shortLeagueName}
            </p>
            )
        )}
      </div>
      {popupContent && popupPosition && (
        <div
          ref={popupRef}
          className={styles["popup"]}
          style={{ top: popupPosition.y + window.scrollY, left: popupPosition.x + window.scrollX }}
        >
          <div className={styles["popup-content"]}>
            <p>{popupContent}</p>
            <IconButton icon={<CloseIcon color="var(--text-color)" />} onClick={closePopup} className={styles["close"]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCondensed;
