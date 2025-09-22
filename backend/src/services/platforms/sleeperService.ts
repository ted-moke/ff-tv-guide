import { getDb } from "../../firebase";
import type { League, Team, Player } from "../../types/shared";
import { ApiTrackingService } from "../apiTrackingService";
import fetchFromUrl from "../../utils/fetchFromUrl";
import { getCurrentWeek } from "../../utils/getCurrentWeek";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";
import { SleeperMatchup, SleeperRoster } from "../../types/sleeperTypes";
import { generateShortLeagueName } from "../../utils/generateShortLeagueName";
import { ContentionMonitor } from "../../utils/contentionMonitor";

export class SleeperService {
  private static instance: SleeperService;
  private nflPlayers: any;

  private constructor() {
    this.loadNFLPlayers();
  }

  public static getInstance(): SleeperService {
    if (!SleeperService.instance) {
      SleeperService.instance = new SleeperService();
    }
    return SleeperService.instance;
  }

  private loadNFLPlayers() {
    const filePath = path.join(
      process.cwd(),
      "src",
      "seed",
      "nflPlayers-2025.json",
    );
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
    leagueMasterId,
    season,
  }: {
    leagueName: string;
    externalLeagueId: string;
    platformCredentialId: string;
    leagueMasterId: string;
    season: number;
  }): Promise<League> {
    console.log(
      "Starting upsert league: ",
      platformCredentialId,
      externalLeagueId,
      season,
    );
    const db = await getDb();
    const leaguesCollection = db.collection("leagues");

    // Look for existing league with same externalLeagueId and season
    const existingLeagueQuery = await leaguesCollection
      .where("externalLeagueId", "==", externalLeagueId)
      .where("season", "==", season)
      .limit(1)
      .get();

    if (!existingLeagueQuery.empty) {
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      const existingLeagueData = existingLeagueDoc.data() as League;

      // If the league has no settings, fetch the league data from sleeper and set the settings
      if (existingLeagueData.settings == null) {
        console.log("League has no settings, fetching from sleeper");
        const sleeperLeagueData = await fetchSleeperLeague(externalLeagueId);
        const isBestBall = sleeperLeagueData.settings?.best_ball === 1;
        existingLeagueData.settings = {
          isBestBall: !!isBestBall,
        };
        await existingLeagueDoc.ref.update({
          settings: existingLeagueData.settings,
        });
      } else {
        console.log("League has settings, skipping fetch from sleeper");
        console.log("Existing league data", existingLeagueData);
      }

      return existingLeagueData;
    }

    const sleeperLeagueData = await fetchSleeperLeague(externalLeagueId);
    const isBestBall = sleeperLeagueData.settings?.best_ball === 1;

    const leagueData: League = {
      leagueMasterId,
      name: leagueName,
      platform: { name: "sleeper", id: platformCredentialId },
      externalLeagueId,
      season,
      lastModified: new Date(),
      settings: {
        isBestBall: !!isBestBall,
      },
    };
    const newLeagueRef = await leaguesCollection.add(leagueData);
    const finalLeagueData = { ...leagueData, id: newLeagueRef.id };
    await newLeagueRef.update({ id: newLeagueRef.id });

    // Send optimistic update to frontend
    return finalLeagueData;
  }

  async upsertTeams(league: League) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const db = await getDb();
        const week = getCurrentWeek();
        const teamsCollection = db.collection("teams");

        // Fetch all necessary data upfront
        let [matchups, rosters] = await Promise.all([
          this.fetchMatchups(league.externalLeagueId, week),
          this.fetchRosters(league.externalLeagueId),
        ]);

        // Filter out matchups that don't have a matchup_id
        const teamToMatchupMap = new Map<number, number>();
        const pairedMatchups = new Map<string, SleeperMatchup[]>();
        matchups = matchups.filter((matchup) => matchup.matchup_id != null);

        // Mold the sleeper matchup data into something easier to work with
        for (const matchup of matchups) {
          if (matchup.matchup_id == null) continue;

          if (!pairedMatchups.has(matchup.matchup_id.toString())) {
            pairedMatchups.set(matchup.matchup_id.toString(), []);
          }
          pairedMatchups.get(matchup.matchup_id.toString())?.push(matchup);
          teamToMatchupMap.set(matchup.roster_id, matchup.matchup_id);
        }

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

        // Process teams in smaller batches to reduce contention
        const BATCH_SIZE = 10; // Reduced batch size
        const teamBatches = this.chunkArray(rosters, BATCH_SIZE);

        console.log(`Processing ${rosters.length} teams for league ${league.name} in ${teamBatches.length} batches of ${BATCH_SIZE}`);

        for (let batchIndex = 0; batchIndex < teamBatches.length; batchIndex++) {
          const teamBatch = teamBatches[batchIndex];
          const batch = db.batch();
          
          console.log(`Processing batch ${batchIndex + 1}/${teamBatches.length} for league ${league.name} (${teamBatch.length} teams)`);
          
          for (const teamInLoop of teamBatch) {
            const matchupId = teamToMatchupMap.get(teamInLoop.roster_id);
            const matchup = matchupId
              ? pairedMatchups.get(matchupId.toString())
              : null;

            const opponentTeam = matchup
              ? matchup.find(
                  (matchup: any) => matchup.roster_id !== teamInLoop.roster_id,
                )
              : undefined;

            const opponentId = opponentTeam?.roster_id.toString();
            const opponentPoints = opponentTeam?.points;

            const teamInMatchup = matchup?.find(
              (matchup: any) => matchup.roster_id === teamInLoop.roster_id,
            );

            // Take our matchup and roster info and create the internal team object
            const team = this.createTeamObject({
              matchup: teamInMatchup,
              opponentId,
              opponentPoints,
              rosterInfo: teamInLoop,
              league,
            });
            if (!team) continue;

            // Update the internal teams in our db
            const existingTeam = existingTeamsMap.get(team.externalTeamId);
            if (existingTeam) {
              batch.update(existingTeam.ref, { ...team, id: existingTeam.id });
            } else {
              const newTeamRef = teamsCollection.doc();
              batch.set(newTeamRef, { ...team, id: newTeamRef.id });
            }
          }

          // Add retry logic for batch commits
          console.log(`Committing batch ${batchIndex + 1}/${teamBatches.length} for league ${league.name}`);
          await this.commitBatchWithRetry(batch, league.name);
          console.log(`Successfully committed batch ${batchIndex + 1}/${teamBatches.length} for league ${league.name}`);
        }

        // Clear large data structures
        existingTeamsMap.clear();
        return; // Success, exit retry loop

      } catch (error) {
        retryCount++;
        console.error(`Error upserting teams for league ${league.name} (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount >= maxRetries) {
          if (error instanceof Error) {
            throw new Error(`Failed to upsert teams after ${maxRetries} attempts: ${error.message}`);
          } else {
            throw new Error(`Failed to upsert teams after ${maxRetries} attempts: Unknown error`);
          }
        }

        // Exponential backoff with jitter
        const baseDelay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        const jitter = Math.random() * 1000; // Add up to 1s of jitter
        const delay = baseDelay + jitter;
        
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private createTeamObject({
    matchup,
    rosterInfo,
    league,
    opponentId,
    opponentPoints,
  }: {
    matchup?: SleeperMatchup;
    rosterInfo: SleeperRoster;
    league: League;
    opponentId?: string;
    opponentPoints?: number;
  }): Team | null {
    if (!rosterInfo) {
      console.error("No roster info found for team");
      return null;
    }

    const wins = rosterInfo.settings.wins ?? 0;
    const losses = rosterInfo.settings.losses ?? 0;
    const ties = rosterInfo.settings.ties ?? 0;
    const pointsFor = rosterInfo.settings.fpts
      ? parseFloat(
          `${rosterInfo.settings.fpts}.${rosterInfo.settings.fpts_decimal}`,
        )
      : 0;
    const pointsAgainst = rosterInfo.settings.fpts_against
      ? parseFloat(
          `${rosterInfo.settings.fpts_against}.${rosterInfo.settings.fpts_against_decimal}`,
        )
      : 0;
    const currentWeek = getCurrentWeek();
    const averagePointsFor = currentWeek - 1 > 0 ? pointsFor / (currentWeek - 1) : 0;

    return {
      externalLeagueId: league.externalLeagueId,
      externalTeamId: rosterInfo.roster_id.toString(),
      platformId: league.platform.name,
      leagueId: league.id || "",
      leagueMasterId: league.leagueMasterId,
      leagueName: league.name,
      shortLeagueName: generateShortLeagueName(league.name),
      season: league.season,
      name: `Team ${rosterInfo.roster_id}`,
      externalUsername: "",
      externalUserId: rosterInfo.owner_id || "",
      weekPoints: matchup?.points ?? 0,
      weekPointsAgainst: opponentPoints ?? 0,
      opponentId: opponentId ?? null,
      coOwners: rosterInfo.co_owners ?? [],
      playerData: matchup ? this.processPlayerData({ matchup, league }) : [],
      stats: {
        wins,
        losses,
        ties,
        pointsFor,
        pointsAgainst,
        averagePointsFor,
      },
      lastSynced: new Date(),
      lastFetched: new Date(),
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
        if (
          team.externalUserId === externalUserId ||
          team.coOwners.includes(externalUserId)
        ) {
          // Check if the userTeam already exists for this leagueMaster
          const userTeamQuery = await userTeamsCollection
            .where("userId", "==", userId)
            .where("leagueMasterId", "==", league.leagueMasterId)
            .get();

          if (userTeamQuery.empty) {
            await userTeamsCollection.add({
              userId: userId,
              leagueMasterId: league.leagueMasterId,
              teamId: teamDoc.id,
            });
          } else {
            // Update existing userTeam with new team and season
            const existingUserTeamDoc = userTeamQuery.docs[0];
            await existingUserTeamDoc.ref.update({
              userId: userId,
              leagueMasterId: league.leagueMasterId,
              teamId: teamDoc.id,
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
  ): Promise<SleeperMatchup[]> {
    await ApiTrackingService.trackApiCall(
      "sleeper",
      `GET league/${externalLeagueId}/matchups/${week}`,
    );
    const matchupsSchema = z.array(
      z.object({
        roster_id: z.number(),
        matchup_id: z.number().nullable().optional(),
        players: z.array(z.string()),
        starters: z.array(z.string()).nullable(),
        points: z.number(),
      }),
    );

    try {
      const data = await fetchFromUrl(
        `https://api.sleeper.app/v1/league/${externalLeagueId}/matchups/${week}`,
      );
      const validMatchups = this.ensurePlayersArray(data);
      return matchupsSchema.parse(validMatchups);
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

  private async fetchRosters(
    externalLeagueId: string,
  ): Promise<SleeperRoster[]> {
    // await ApiTrackingService.trackApiCall("sleeper", "GET leagues/rosters");
    const rostersSchema = z.array(
      z.object({
        roster_id: z.number(),
        owner_id: z.string().optional(),
        co_owners: z.array(z.string()).optional().nullable(),
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

  private processPlayerData({
    matchup,
    league,
  }: {
    matchup: SleeperMatchup;
    league: League;
  }): Player[] {
    if (!matchup.players) return [];

    return matchup.players
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

          let rosterSlotType = "bench";
          if (matchup.starters == null || matchup.starters.includes(playerId)) {
            rosterSlotType = "start";
          }
          if (league.settings?.isBestBall) {
            rosterSlotType = "bestBall";
          }

          return {
            name: fullName,
            logicalName: logicalName,
            team: playerInfo.team,
            position: playerInfo.position,
            rosterSlotType,
          };
        } catch (error) {
          console.error(`Error processing player with ID ${playerId}:`, error);
          return null;
        }
      })
      .filter((player) => player !== null) as Player[];
  }

  private ensurePlayersArray(matchups: any[]): any[] {
    return matchups.map((matchup) => ({
      ...matchup,
      players: matchup.players || [],
    }));
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async commitBatchWithRetry(batch: FirebaseFirestore.WriteBatch, leagueName: string, maxRetries: number = 3): Promise<void> {
    let retryCount = 0;
    const contentionMonitor = ContentionMonitor.getInstance();
    
    while (retryCount < maxRetries) {
      try {
        await batch.commit();
        return; // Success
      } catch (error: any) {
        retryCount++;
        
        // Check if it's a contention error
        if (error.code === 10 || error.message?.includes('contention') || error.message?.includes('ABORTED')) {
          // Log contention event
          contentionMonitor.logContentionEvent({
            leagueId: '', // We don't have league ID in this context
            leagueName,
            operation: 'batch_commit',
            errorCode: error.code || 10,
            errorMessage: error.message || 'Unknown contention error',
            retryCount,
            batchSize: 10, // Our batch size
          });

          if (retryCount >= maxRetries) {
            console.error(`Failed to commit batch for league ${leagueName} after ${maxRetries} attempts:`, error);
            throw error;
          }
          
          // Exponential backoff with jitter
          const baseDelay = Math.pow(2, retryCount) * 1000;
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;
          
          console.log(`Batch contention for league ${leagueName}, retrying in ${Math.round(delay)}ms (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Non-contention error, don't retry
          throw error;
        }
      }
    }
  }

  async upsertLeagueSettings(leagueId: string) {
    const db = await getDb();
    const leagueRef = db.collection("leagues").doc(leagueId);
    const leagueDoc = await leagueRef.get();
    if (!leagueDoc.exists) {
      throw new Error(`League with ID ${leagueId} not found`);
    }
    const leagueData = leagueDoc.data() as League;
    if (leagueData.settings != null) {
      console.log(
        `League settings already exist for ${leagueData.platform.name}`,
      );
      return;
    }

    const sleeperLeagueData = await fetchSleeperLeague(
      leagueData.externalLeagueId,
    );
    const isBestBall = sleeperLeagueData.settings?.best_ball === 1;
    leagueData.settings = { isBestBall: !!isBestBall };
    await leagueRef.update({ settings: leagueData.settings });
  }
}

export const fetchSleeperUserLeagues = async (
  externalUserId: string,
  season: number,
) => {
  const data = await fetchFromUrl(
    `https://api.sleeper.app/v1/user/${externalUserId}/leagues/nfl/${season}`,
  );

  const leagues = data.map((league: any) => ({
    ...league,
    id: league.league_id, // Sleeper uses 'league_id'
  }));
  return leagues;
};

export const fetchSleeperLeague = async (externalLeagueId: string) => {
  const data = await fetchFromUrl(
    `https://api.sleeper.app/v1/league/${externalLeagueId}`,
  );
  return data;
};
