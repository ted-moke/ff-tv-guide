import { Player } from "../../../types/shared";
import styles from "./PlayerInLeagueCard.module.css";
import { useView } from "../../view/ViewContext";

export const PlayerInLeagueCard = ({ player }: { player: Player | null }) => {
    const { isMobile } = useView();
  if (!player) {
    return (
      <div className={`${styles.playerInLeagueCard} ${styles.none} ${isMobile ? styles.mobile : ""}`}>
        <p className="muted">None</p>
      </div>
    );
  }

  return (
    <div className={`${styles.playerInLeagueCard} ${isMobile ? styles.mobile : ""}`}>
      <p className={`${styles.playerPosition} ${styles[player.position]}`}>
        {player.position}
      </p>
      <p>{player.name}</p>
      <p className="muted">{player.team}</p>
    </div>
  );
};
