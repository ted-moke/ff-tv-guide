import { Player } from "../../../types/shared";
import styles from "./PlayerInLeagueCard.module.css";

export const PlayerInLeagueCard = ({ player }: { player: Player | null }) => {
  if (!player) {
    return (
      <div className={`${styles.playerInLeagueCard} ${styles.none}`}>
        <p className="muted">None</p>
      </div>
    );
  }

  return (
    <div className={styles.playerInLeagueCard}>
      <p className={`${styles.playerPosition} ${styles[player.position]}`}>
        {player.position}
      </p>
      <p>{player.name}</p>
      <p>{player.team}</p>
    </div>
  );
};
