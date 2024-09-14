import React from "react";
import { Player as PlayerType } from "../nfl/nflTypes";
import styles from "./PlayerCondensed.module.css";
import Pip from "../../components/ui/Pip";

interface PlayerProps {
  player: PlayerType;
}

const PlayerCondensed: React.FC<PlayerProps> = ({ player }) => {
  if (!player) return null;

  const userTeams = player.copies.map(copy => copy.leagueName);
  const uniqueUserTeams = [...new Set(userTeams)];

  return (
    <div
      key={player.name}
      className={styles.player}
      title={`${uniqueUserTeams.join("\n")}`}
    >
      <p className={`${styles["player-team"]} ${styles[player.team]}`}>
        {player.team}
      </p>
      <p className={`${styles["player-position"]} ${styles[player.position]}`}>
        {player.position}
      </p>
      <p className={styles["player-name"]}>{player.name}</p>
      <div className={styles["player-user-teams"]}>
        {player.copies.map((copy, index) => (
          <Pip 
            key={`${player.name}-${copy.leagueId}-${index}`} 
            type={copy.team} 
            style={copy.rosterSlotType === 'starter' ? "full" : "outline"}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerCondensed;
