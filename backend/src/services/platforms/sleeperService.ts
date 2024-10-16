import { getDb } from "../../firebase";
import { League } from "../../models/league";
import { Team, Player } from "../../models/team";
import { ApiTrackingService } from "../apiTrackingService";
import fetchFromUrl from "../../utils/fetchFromUrl";
import { getCurrentWeek } from "../../utils/getCurrentWeek";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

export class SleeperService {
  private nflPlayers: any;

  constructor() {
    this.loadNFLPlayers();
  }

  private loadNFLPlayers() {
    const filePath = path.join(process.cwd(), "src", "seed", "nflPlayers.json");
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      this.nflPlayers = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error loading NFL players data:", error);
      this.nflPlayers = {}; // Set to empty object to prevent further errors
    }
  }

  async upsertLeague({
    leagueName,
    externalLeagueId,
    platformCredentialId,
    lastModified,
  }: {
    leagueName: string;
    externalLeagueId: string;
    platformCredentialId: string;
    lastModified: Date;
  }): Promise<League> {
    console.log(
      "Starting upsert league: ",
      platformCredentialId,
      externalLeagueId,
    );
    const db = await getDb();
    const leaguesCollection = db.collection("leagues");
    const leagueData: League = {
      name: leagueName,
      platform: { name: "sleeper", id: platformCredentialId },
      externalLeagueId,
      lastModified,
    };
    const existingLeagueQuery = await leaguesCollection
      .where("externalLeagueId", "==", externalLeagueId)
      .limit(1)
      .get();

    if (!existingLeagueQuery.empty) {
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      await existingLeagueDoc.ref.update({
        ...leagueData,
        id: existingLeagueDoc.id,
      });
      return { ...leagueData, id: existingLeagueDoc.id };
    } else {
      const newLeagueRef = await leaguesCollection.add(leagueData);
      await newLeagueRef.update({ id: newLeagueRef.id });
      return { ...leagueData, id: newLeagueRef.id };
    }
  }

  async upsertTeams(league: League) {
    try {
      const db = await getDb();
      const week = getCurrentWeek();
      const teamsCollection = db.collection("teams");

      console.log("Fetching teams collection for league:", league.name);
      // Fetch all necessary data upfront
      const [matchups, rosters] = await Promise.all([
        this.fetchMatchups(league.externalLeagueId, week),
        this.fetchRosters(league.externalLeagueId),
      ]);
      console.log("Fetched matchups and rosters for league:", league.name);

      // Create a map of roster_id to owner_id and roster settings
      const rosterMap = new Map(
        rosters.map((roster: any) => [
          roster.roster_id.toString(),
          {
            owner_id: roster.owner_id,
            settings: roster.settings,
          },
        ]),
      );

      console.log("Created roster map for league:", league.name);

      // Fetch all existing teams for this league in one query
      const existingTeamsSnapshot = await teamsCollection
        .where("leagueId", "==", league.id)
        .get();
      const existingTeamsMap = new Map(
        existingTeamsSnapshot.docs.map((doc) => [
          doc.data().externalTeamId,
          doc,
        ]),
      );

      console.log("Created existing teams map for league:", league.name);

      // Process matchups in batches
      const BATCH_SIZE = 16;
      for (let i = 0; i < matchups.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const matchupBatch = matchups.slice(i, i + BATCH_SIZE);

        for (const matchup of matchupBatch) {
          const team = this.createTeamObject(
            matchup,
            rosterMap as Map<string, any>,
            league,
          );
          if (!team) continue;

          const existingTeam = existingTeamsMap.get(team.externalTeamId);
          if (existingTeam) {
            batch.update(existingTeam.ref, { ...team, id: existingTeam.id });
          } else {
            const newTeamRef = teamsCollection.doc();
            batch.set(newTeamRef, { ...team, id: newTeamRef.id });
          }
        }

        console.log("Committing batch for league:", league.name);

        await batch.commit();
      }
      console.log("Committed all matchups for league:", league.name);

      // Clear large data structures
      rosterMap.clear();
      existingTeamsMap.clear();
    } catch (error) {
      console.error(`Error upserting teams for league ${league.name}:`, error);
      if (error instanceof Error) {
        throw new Error(`Failed to upsert teams: ${error.message}`);
      } else {
        throw new Error("Failed to upsert teams: Unknown error");
      }
    }
  }

  private createTeamObject(
    matchup: any,
    rosterMap: Map<string, any>,
    league: League,
  ): Team | null {
    const rosterInfo = rosterMap.get(matchup.roster_id.toString());
    if (!rosterInfo) {
      console.error("Roster info not found for roster_id:", matchup.roster_id);
      return null;
    }

    return {
      externalLeagueId: league.externalLeagueId,
      externalTeamId: matchup.roster_id.toString(),
      platformId: league.platform.name,
      leagueId: league.id || "",
      leagueName: league.name,
      name: `Team ${matchup.roster_id}`,
      externalUsername: "",
      externalUserId: rosterInfo.owner_id || "",
      opponentId: matchup.matchup_id ? matchup.matchup_id.toString() : "",
      playerData: this.processPlayerData(matchup.players, matchup.starters),
      stats: {
        wins: rosterInfo.settings.wins ?? 0,
        losses: rosterInfo.settings.losses ?? 0,
        ties: rosterInfo.settings.ties ?? 0,
        pointsFor: rosterInfo.settings.fpts
          ? parseFloat(
              `${rosterInfo.settings.fpts}.${rosterInfo.settings.fpts_decimal}`,
            )
          : 0,
        pointsAgainst: rosterInfo.settings.fpts_against
          ? parseFloat(
              `${rosterInfo.settings.fpts_against}.${rosterInfo.settings.fpts_against_decimal}`,
            )
          : 0,
      },
    };
  }

  async upsertUserTeams({
    league,
    externalUserId,
    userId,
  }: {
    league: League;
    externalUserId: string;
    userId: string;
  }) {
    try {
      const db = await getDb();
      const teamsCollection = db.collection("teams");
      const userTeamsCollection = db.collection("userTeams");

      const teamsQuery = await teamsCollection
        .where("leagueId", "==", league.id)
        .get();

      for (const teamDoc of teamsQuery.docs) {
        const team = teamDoc.data() as Team;
        if (team.externalUserId === externalUserId) {
          // Check if the userTeam already exists
          const userTeamQuery = await userTeamsCollection
            .where("userId", "==", userId)
            .where("teamId", "==", teamDoc.id)
            .get();

          if (userTeamQuery.empty) {
            await userTeamsCollection.add({
              userId: userId,
              teamId: teamDoc.id,
              leagueId: league.id,
            });
          } else {
            // Update existing userTeam
            const existingUserTeamDoc = userTeamQuery.docs[0];
            await existingUserTeamDoc.ref.update({
              userId: userId,
              teamId: teamDoc.id,
              leagueId: league.id,
            });
          }
          break; // We've found the user's team, no need to continue
        }
      }
    } catch (error) {
      throw new Error(`Error creating userTeam: ${userId}, ${league.id}`);
    }
  }

  private async fetchMatchups(
    externalLeagueId: string,
    week: number,
  ): Promise<any> {
    await ApiTrackingService.trackApiCall("sleeper", "GET leagues/matchups");
    const matchupsSchema = z.array(
      z.object({
        roster_id: z.number(),
        matchup_id: z.number().optional(),
        players: z.array(z.string()),
        starters: z.array(z.string()).nullable(),
      }),
    );

    try {
      const data = await fetchFromUrl(
        `https://api.sleeper.app/v1/league/${externalLeagueId}/matchups/${week}`,
      );
      return matchupsSchema.parse(data);
    } catch (error) {
      console.error(
        `Error fetching matchups for league ${externalLeagueId}:`,
        error,
      );
      if (error instanceof Error) {
        throw new Error(`Failed to fetch matchups: ${error.message}`);
      } else {
        throw new Error("Failed to fetch matchups: Unknown error");
      }
    }
  }

  private async fetchRosters(externalLeagueId: string): Promise<any> {
    await ApiTrackingService.trackApiCall("sleeper", "GET leagues/rosters");
    const rostersSchema = z.array(
      z.object({
        roster_id: z.number(),
        owner_id: z.string().optional(),
        settings: z.object({
          wins: z.number().optional(),
          losses: z.number().optional(),
          ties: z.number().optional(),
          fpts: z.number().optional(),
          fpts_decimal: z.number().optional(),
          fpts_against: z.number().optional(),
          fpts_against_decimal: z.number().optional(),
        }),
      }),
    );

    try {
      const data = await fetchFromUrl(
        `https://api.sleeper.app/v1/league/${externalLeagueId}/rosters`,
      );
      return rostersSchema.parse(data);
    } catch (error) {
      console.error(
        `Error fetching rosters for league ${externalLeagueId}:`,
        error,
      );
      if (error instanceof Error) {
        throw new Error(`Failed to fetch rosters: ${error.message}`);
      } else {
        throw new Error("Failed to fetch rosters: Unknown error");
      }
    }
  }

  private processPlayerData(players: string[], starters: string[]): Player[] {
    return players
      .map((playerId) => {
        try {
          const playerInfo = this.nflPlayers[playerId];
          if (!playerInfo) {
            console.warn(`Player info not found for ID: ${playerId}`);
            return null;
          }

          let fullName = playerInfo.full_name;
          let logicalName = playerInfo.full_name
            ?.toLowerCase()
            .replace(/\s/g, "");
          if (!fullName && playerInfo.position === "DEF") {
            fullName = playerInfo.player_id;
            logicalName = playerInfo.player_id.toLowerCase().replace(/\s/g, "");
          }

          return {
            name: fullName,
            logicalName: logicalName,
            team: playerInfo.team,
            position: playerInfo.position,
            rosterSlotType:
              starters == null || starters.includes(playerId)
                ? "start"
                : "bench",
          };
        } catch (error) {
          console.error(`Error processing player with ID ${playerId}:`, error);
          return null;
        }
      })
      .filter((player) => player !== null) as Player[];
  }
}
