import React from 'react';
import { Player } from "../features/nfl/nflTypes";
import styles from "./PlayerList.module.css";

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (  
    <>
      {players.map((player) => (
        <div
          key={player.name}
          className={styles.player}
          title={`${player.userTeams.join("\n")}`}
        >
          <p className={styles["player-team"]}>{player.team}</p>
          <p
            className={`${styles["player-position"]} ${
              styles[player.position]
            }`}
          >
            {player.position}
          </p>
          <p className={styles["player-name"]}>{player.name}{player.userTeams.length > 1
              ? ` x${player.userTeams.length}`
              : ""}</p>
          <div className={styles["player-user-teams"]}>
            {player.userTeams.map((userTeam) => (
              <p key={`${player.name}-${userTeam}`}>{userTeam}</p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PlayerList;