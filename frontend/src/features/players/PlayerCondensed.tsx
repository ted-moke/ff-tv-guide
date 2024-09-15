import React from "react";
import { Player as PlayerType } from "../nfl/nflTypes";
import styles from "./PlayerCondensed.module.css";
// import Pip from "../../components/ui/Pip";

interface PlayerProps {
  player: PlayerType;
}

const PlayerCondensed: React.FC<PlayerProps> = ({ player }) => {
  if (!player) return null;

  const uniqueUserTeams = [...new Set(player.copies.map(copy => copy.leagueName))];

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
      <div className={styles["player-user-teams-text"]}>
        {player.copies.map((copy, index) => (
          <p key={`${player.name}-${copy.leagueId}-${index}`}>{copy.shortLeagueName}</p>
        ))}
      </div>
      {/* // <div className={styles["player-user-teams"]}>
      //   {player.copies.map((copy, index) => (
      //     <p key={`${player.name}-${copy.leagueId}-${index}`}>{copy.shortLeagueName}</p>
      //     <Pip 
      //       key={`${player.name}-${copy.leagueId}-${index}`} 
      //       type={copy.team} 
      //       style={copy.rosterSlotType === 'start' ? "full" : copy.rosterSlotType === 'bestBall' ? "stroked" : "dash"}
      //     />
      //   ))}
      // </div> */}
    </div>
  );
};

export default PlayerCondensed;
