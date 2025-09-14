import { useMemo } from "react";
import { Player, OwnedPlayer } from "../nfl/nflTypes";
import { PlayedStatus } from "../../types/shared";
import { FantasyTeam } from "../teams/teamTypes";
import { TeamPlayedStatusMap } from "../nfl/getTeamPlayedStatusMap";

export const IDPPositions = ["DB", "S", "CB", "DE", "EDR", "DL", "IL", "LB"];

// Define the order of positions
const positionOrder = ["QB", "RB", "WR", "TE", "K", "DEF", ...IDPPositions];

// Custom sorting function
const sortPlayers = (a: Player, b: Player) => {
  const aHasSelfCopy = a.copies.some((copy) => copy.team === "self");
  const bHasSelfCopy = b.copies.some((copy) => copy.team === "self");

  if (aHasSelfCopy && !bHasSelfCopy) {
    return -1; // a comes before b
  } else if (!aHasSelfCopy && bHasSelfCopy) {
    return 1; // b comes before a
  }

  const aIndex = positionOrder.indexOf(a.position);
  const bIndex = positionOrder.indexOf(b.position);

  if (aIndex !== bIndex) {
    // If positions are different, sort by position order
    return aIndex - bIndex;
  } else if (aIndex === -1) {
    // If both positions are not in the positionOrder array, sort alphabetically by position
    return a.position.localeCompare(b.position);
  } else {
    // If positions are the same, sort alphabetically by name
    return a.name.localeCompare(b.name);
  }
};

// Sorting function for copies
const sortCopies = (a: OwnedPlayer, b: OwnedPlayer): number => {
  const order = {
    start: 0,
    bestBall: 1,
    bench: 2,
  };
  const teamOrder = {
    self: 0,
    opponent: 1,
  };

  if (a.rosterSlotType !== b.rosterSlotType) {
    return order[a.rosterSlotType] - order[b.rosterSlotType];
  }
  if (a.team !== b.team) {
    return teamOrder[a.team] - teamOrder[b.team];
  }
  return a.leagueName.localeCompare(b.leagueName);
};

export type UsePlayerOptions = {
  hideBenchPlayers?: boolean;
  hideIDPlayers?: boolean;
};

type UsePlayerProps = {
  selfTeams: FantasyTeam[];
  opponentTeams?: FantasyTeam[];
  options?: UsePlayerOptions;
  teamPlayedStatusMap: TeamPlayedStatusMap | null;
};

export const usePlayers = ({
  options,
  selfTeams,
  opponentTeams,
  teamPlayedStatusMap,
}: UsePlayerProps) => {
  if (!options) {
    options = {};
  }
  if (!options.hideBenchPlayers) {
    options.hideBenchPlayers = false;
  }
  if (!options.hideIDPlayers) {
    options.hideIDPlayers = false;
  }

  let hasIDPlayers = false;

  const players: Player[] | null = useMemo(() => {
    if (!selfTeams) {
      return [];
    }

    const playerMap = new Map<string, Player>();

    const processTeams = (
      teams: FantasyTeam[],
      teamType: "self" | "opponent"
    ) => {
      teams.forEach((team) => {
        team.playerData.forEach((player) => {
          if (IDPPositions.includes(player.position)) {
            hasIDPlayers = true;

            if (options.hideIDPlayers) {
              return;
            }
          }
          let playedStatus: PlayedStatus = 'unknown';
          if (teamPlayedStatusMap) {
            if (teamPlayedStatusMap.completed.has(player.team)) {
              playedStatus = 'completed';
            } else if (teamPlayedStatusMap.inProgress.has(player.team)) {
              playedStatus = 'inProgress';
            }
            if (teamPlayedStatusMap.upcoming.has(player.team)) {
              playedStatus = 'upcoming';
            }
          }

          // if there's two players with the same name AND position, this could break
          // but it's unlikely. TODO fix this
          const key = `${player.name}-${player.position}`;
          if (!playerMap.has(key)) {
            playerMap.set(key, {
              name: player.name,
              team: player.team,
              position: player.position,
              copies: [],
              playedStatus,
            });
          }


          const ownedPlayer: OwnedPlayer = {
            leagueName: team.leagueName,
            shortLeagueName: team.shortLeagueName,
            leagueId: team.leagueId,
            externalLeagueId: team.externalLeagueId,
            platformId: team.platformId,
            rosterSlotType: player.rosterSlotType as
              | "start"
              | "bench"
              | "bestBall",
            team: teamType,
          };
          if (
            options.hideBenchPlayers &&
            ownedPlayer.rosterSlotType === "bench"
          ) {
            return;
          }
          playerMap.get(key)!.copies.push(ownedPlayer);
        });
      });
    };

    processTeams(selfTeams, "self");

    if (opponentTeams) {
      processTeams(opponentTeams, "opponent");
    }

    // Sort copies for each player
    playerMap.forEach((player) => {
      player.copies.sort(sortCopies);
    });

    return Array.from(playerMap.values()).sort(sortPlayers);
  }, [
    selfTeams,
    opponentTeams,
    options.hideBenchPlayers,
    options.hideIDPlayers,
    hasIDPlayers,
  ]);

  return {
    players,
    hasIDPlayers,
  };
};

// Update getPlayersByTeam function to use the new Player type
export const getPlayersByTeam = (teamCodes: string[], players: Player[]) => {
  const teamPlayers = players.filter((player) =>
    teamCodes.includes(player.team)
  );

  const selfPlayers = teamPlayers.filter((player) =>
    player.copies.some((copy) => copy.team === "self")
  );

  const opponentPlayers = teamPlayers.filter((player) =>
    player.copies.some((copy) => copy.team === "opponent")
  );

  const filteredStarters = teamPlayers
    .filter((player) =>
      player.copies.some(
        (copy) =>
          copy.rosterSlotType === "start" || copy.rosterSlotType === "bestBall"
      )
    )
    .map((player) => ({
      ...player,
      copies: player.copies.filter(
        (copy) =>
          copy.rosterSlotType === "start" || copy.rosterSlotType === "bestBall"
      ),
    }));

  const filteredOthers = teamPlayers
    .filter(
      (player) =>
        player.copies.some(
          (copy) =>
            copy.rosterSlotType !== "start" &&
            copy.rosterSlotType !== "bestBall"
        ) && player.copies.some((copy) => copy.team === "self")
    )
    .map((player) => ({
      ...player,
      copies: player.copies.filter(
        (copy) =>
          copy.rosterSlotType !== "start" && copy.rosterSlotType !== "bestBall"
      ),
    }));

  const sortPlayers = (a: Player, b: Player) => {
    const aHasSelfCopy = a.copies.some((copy) => copy.team === "self");
    const bHasSelfCopy = b.copies.some((copy) => copy.team === "self");

    if (aHasSelfCopy && !bHasSelfCopy) {
      return -1; // a comes before b
    } else if (!aHasSelfCopy && bHasSelfCopy) {
      return 1; // b comes before a
    }

    const aIndex = positionOrder.indexOf(a.position);
    const bIndex = positionOrder.indexOf(b.position);

    if (aIndex !== bIndex) {
      // If positions are different, sort by position order
      return aIndex - bIndex;
    } else if (aIndex === -1) {
      // If both positions are not in the positionOrder array, sort alphabetically by position
      return a.position.localeCompare(b.position);
    } else {
      // If positions are the same, sort alphabetically by name
      return a.name.localeCompare(b.name);
    }
  };

  return {
    starters: filteredStarters.sort(sortPlayers),
    others: filteredOthers.sort(sortPlayers),
    allSelf: selfPlayers.sort(sortPlayers),
    allOpponent: opponentPlayers.sort(sortPlayers),
    all: teamPlayers.sort(sortPlayers),
  };
};
