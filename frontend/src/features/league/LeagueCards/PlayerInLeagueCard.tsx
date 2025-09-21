import { Player } from "../../../types/shared";
import styles from "./PlayerInLeagueCard.module.css";
import { useView } from "../../view/ViewContext";

export const PlayerInLeagueCard = ({ player, hasPlayed = false }: { player: Player | null, hasPlayed?: boolean }) => {
    const { isMobile } = useView();
  if (!player) {
    return (
      <div className={`${styles.playerInLeagueCard} ${styles.none} ${isMobile ? styles.mobile : ""}`}>
        <p className="muted">None</p>
      </div>
    );
  }

  return (
    <div className={`${styles.playerInLeagueCard} ${isMobile ? styles.mobile : ""} ${hasPlayed ? styles.hasPlayed : ""}`}>
      <p className={`${styles.playerPosition} ${styles[player.position]}`}>
        {player.position}
      </p>
      <p className={styles.playerName}>{player.name}</p>
      <p className="muted">{player.team}</p>
    </div>
  );
};
