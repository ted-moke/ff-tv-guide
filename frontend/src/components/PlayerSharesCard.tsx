import React from "react";
import styles from "./PlayerSharesCard.module.css";
import { Player } from "../features/nfl/nflTypes";
import PlayerCondensed from "../features/players/PlayerCondensed";

interface PlayerSharesCardProps {
  team: string;
  players: Player[];
  conference: string;
  division: string;
}

const PlayerSharesCard: React.FC<PlayerSharesCardProps> = ({
  team,
  players,
  conference,
  division,
}) => {
  const playerCount = players.reduce(
    (count, player) => count + player.copies.length,
    0
  );

  return (
    <div className={styles.teamCard}>
      <div className={styles.headerWrapper}>
        <div className={styles.teamHeader}>
          <h3>{team}</h3>
          <div className={styles.teamInfo}>
            <p className={styles.division}>
              {conference} {division}
            </p>
          </div>
        </div>
        <div className={styles.subheader}>
          <p className={styles.playerCount}>
            {players.length} players{" "}
            {playerCount !== players.length &&
              `(${playerCount} shares)`}
          </p>
        </div>
      </div>
      {players.length > 0 ? (
        <div className={styles.playersList}>
          <div className={styles.playersHeader}>
            <h6>Pos</h6>
            <h6>Name</h6>
            <h6>Shares</h6>
            <h6> </h6>
          </div>
          {players.map((player) => (
            <PlayerCondensed
              key={`${player.name}-${player.team}`}
              player={player}
              slotType="both"
            />
          ))}
        </div>
      ) : (
        <p className={styles.noPlayers}>
          No fantasy players in this team
        </p>
      )}
    </div>
  );
};

export default PlayerSharesCard;
