import { UsePlayerOptions } from "./usePlayers";
import { Player } from "../nfl/nflTypes";
import { IDPPositions } from "./usePlayers";

export const filterCopies = (players: Player[], options: UsePlayerOptions) => {
  if (!players) {
    return [];
  }

  if (!options) {
    options = {};
  }
  if (!options.hideBenchPlayers) {
    options.hideBenchPlayers = false;
  }
  if (!options.hideIDPlayers) {
    options.hideIDPlayers = false;
  }

  return players.filter((player) => {
    if (options.hideBenchPlayers) {
      const sansBenchCopies = player.copies.filter(
        (copy) => copy.rosterSlotType !== "bench"
      );
      player.copies = sansBenchCopies;
      if (sansBenchCopies.length === 0) {
        return false;
      }
    }
    if (options.hideIDPlayers) {
      if (IDPPositions.includes(player.position)) {
        return false;
      }
    }

    return true;
  });
};
