import { getDb } from "../../firebase";
import type { League, Team, Player } from "../../types/shared";
import {
  FleaflickerLeagueStandings,
  FleaflickerTeam,
  Owner,
} from "../../types/fleaflickerTypes";
import {
  fleaflickerScoreboardResponseSchema,
  FleaflickerScoreboardResponse,
  FleaflickerGame,
  FleaflickerGameTeam,
} from "../../types/fleaflickerSchemas";
import { getCurrentWeek } from "../../utils/getCurrentWeek";
import { ApiTrackingService } from "../apiTrackingService";
import fetchFromUrl from "../../utils/fetchFromUrl";
import z from "zod";
import { getCurrentSeason } from "../../utils/getCurrentSeason";
import { generateShortLeagueName } from "../../utils/generateShortLeagueName";

export class FleaflickerService {
  private static instance: FleaflickerService;

  private constructor() {}

  public static getInstance(): FleaflickerService {
    if (!FleaflickerService.instance) {
      FleaflickerService.instance = new FleaflickerService();
    }
    return FleaflickerService.instance;
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
    console.log("FF Upserting league");
    const db = await getDb();
    const leaguesCollection = db.collection("leagues");

    // Look for existing league with same externalLeagueId and season
    const existingLeagueQuery = await leaguesCollection
      .where("externalLeagueId", "==", externalLeagueId)
      .where("season", "==", season)
      .limit(1)
      .get();

    console.log("Existing league query", existingLeagueQuery.empty);

    if (!existingLeagueQuery.empty) {
      console.log("League already exists");
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      return existingLeagueDoc.data() as League;
    }

    console.log("League does not exist");
    const newLeagueData: League = {
      leagueMasterId,
      name: leagueName,
      platform: { name: "fleaflicker", id: platformCredentialId },
      externalLeagueId,
      season,
      lastModified: new Date(),
    };
    const newLeagueRef = await leaguesCollection.add(newLeagueData);
    const finalLeagueData = { ...newLeagueData, id: newLeagueRef.id };
    await newLeagueRef.update({ id: newLeagueRef.id });

    // Send optimistic update to frontend
    return finalLeagueData;
  }

  async upsertTeams(league: League) {
    try {
      const db = await getDb();
      const week = getCurrentWeek();
      const season = getCurrentSeason();
      const matchups = await this.fetchMatchups(
        league.externalLeagueId,
        week,
        season,
      );
      const teamsCollection = db.collection("teams");

      const currentWeek = getCurrentWeek();

      // Fetch league standings to get owner IDs
      const leagueStandings = await this.fetchLeagueStandings(
        league.externalLeagueId,
      );
      const leagueStandingsMap = new Map<
        string,
        {
          wins: number;
          losses: number;
          ties: number;
          pointsFor: number;
          pointsAgainst: number;
          averagePointsFor: number;
        }
      >(
        leagueStandings.divisions.flatMap((division) =>
          division?.teams
            ? division.teams.map((team) => {
                const wins = team?.recordOverall?.wins ?? 0;
                const losses = team?.recordOverall?.losses ?? 0;
                const ties = team?.recordOverall?.ties ?? 0;
                const pointsFor = team?.pointsFor.value ?? 0;
                const pointsAgainst = team?.pointsAgainst.value ?? 0;
                const averagePointsFor =
                  currentWeek - 1 > 0 ? team?.pointsFor.value / (currentWeek - 1) : 0;

                return [
                  team.id.toString(),
                  {
                    wins,
                    losses,
                    ties,
                    pointsFor,
                    pointsAgainst,
                    averagePointsFor,
                  },
                ];
              })
            : [],
        ),
      );

      const teamOwners = new Map<string, Owner[]>(
        leagueStandings.divisions.flatMap((division) =>
          division?.teams
            ? division.teams.map((team) => [team.id.toString(), team.owners])
            : [],
        ),
      );

      const addAndUpdateTeam = async (
        teamData: FleaflickerTeam,
        opponentId: string,
      ) => {
        const rosterData = await this.fetchRoster(
          league.externalLeagueId,
          teamData.id.toString(),
          season,
          week,
        );

        const owners = teamOwners.get(teamData.id.toString()) || [];
        const primaryOwner = owners[0];
        const coOwners = owners.slice(1).map((owner) => owner.displayName);

        const currentRoster = leagueStandingsMap.get(teamData.id.toString());

        const team: Team = {
          externalLeagueId: league.externalLeagueId,
          externalTeamId: teamData.id.toString(),
          platformId: league.platform.name,
          leagueId: league.id!,
          leagueMasterId: league.leagueMasterId,
          leagueName: league.name,
          shortLeagueName: generateShortLeagueName(league.name),
          season,
          name: teamData.name,
          externalUsername: primaryOwner
            ? primaryOwner.displayName
            : rosterData.ownerName,
          externalUserId: primaryOwner
            ? primaryOwner.id.toString()
            : rosterData.ownerId.toString(),
          coOwners,
          opponentId: opponentId.toString(),
          playerData: this.processPlayerData(rosterData.groups),
          stats: {
            wins: currentRoster?.wins ?? 0,
            losses: currentRoster?.losses ?? 0,
            ties: currentRoster?.ties ?? 0,
            pointsFor: currentRoster?.pointsFor ?? 0,
            pointsAgainst: currentRoster?.pointsAgainst ?? 0,
            averagePointsFor: currentRoster?.averagePointsFor ?? 0,
            winPercentage: teamData.recordOverall.winPercentage.value ?? 0,
          },
          lastSynced: new Date(),
          lastFetched: new Date(),
          weekPoints: teamData.weekPoints ?? 0,
          weekPointsAgainst: teamData.weekPointsAgainst ?? 0,
        };

        // Instead of using externalTeamId as the document ID, let's query for an existing team
        const existingTeamQuery = await teamsCollection
          .where("externalTeamId", "==", teamData.id.toString())
          .where("leagueId", "==", league.id)
          .limit(1)
          .get();

        if (!existingTeamQuery.empty) {
          // Update existing team
          const existingTeamDoc = existingTeamQuery.docs[0];
          await existingTeamDoc.ref.update({ ...team, id: existingTeamDoc.id });
        } else {
          // Create new team with auto-generated ID
          const newTeamRef = await teamsCollection.add(team);
          await newTeamRef.update({ id: newTeamRef.id });
        }
      };

      if (!matchups) {
        console.log("No matchups found");
        return;
      }
      for (const matchup of matchups) {
        // Convert FleaflickerGame to FleaflickerTeam format
        const awayTeam = this.convertGameTeamToFleaflickerTeam(
          matchup.away,
          matchup.awayScore?.score.value ?? 0,
          matchup.homeScore?.score.value ?? 0,
        );
        const homeTeam = matchup.home
          ? this.convertGameTeamToFleaflickerTeam(
              matchup.home,
              matchup.homeScore?.score.value ?? 0,
              matchup.awayScore?.score.value ?? 0,
            )
          : null;

        await addAndUpdateTeam(awayTeam, homeTeam?.id.toString() || "");
        if (homeTeam) {
          await addAndUpdateTeam(homeTeam, awayTeam.id.toString());
        }
      }

      // Clear large data structures
      leagueStandingsMap.clear();
      teamOwners.clear();
    } catch (error) {
      console.error("Error upserting teams", error);
      throw error;
    }
  }

  async upsertUserTeams({
    league,
    externalUserId,
    externalTeamId,
    userId,
  }: {
    league: League;
    externalUserId: string;
    userId: string;
    externalTeamId: string;
  }) {
    const db = await getDb();
    const teamsCollection = db.collection("teams");
    const userTeamsCollection = db.collection("userTeams");

    const externalTeamIdString = externalTeamId.toString();

    const teamsQuery = await teamsCollection
      .where("leagueId", "==", league.id)
      .get();

    for (const teamDoc of teamsQuery.docs) {
      const team = teamDoc.data() as Team;
      if (
        team.externalUserId === externalUserId ||
        team.externalTeamId.toString() === externalTeamIdString
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
  }

  private async fetchMatchups(
    externalLeagueId: string,
    week: number,
    season: number,
  ): Promise<FleaflickerGame[]> {
    try {
      await ApiTrackingService.trackApiCall(
        "fleaflicker",
        `GET leagues/scoreboard?league_id=${externalLeagueId}&season=${season}&scoring_period=${week}`,
      );

      const url = `https://www.fleaflicker.com/api/FetchLeagueScoreboard?league_id=${externalLeagueId}&season=${season}&scoring_period=${week}`;
      const rawData = await fetchFromUrl(url);

      // Temporary fallback: bypass strict validation until we understand the actual response format
      if (Array.isArray(rawData)) {
        return rawData as FleaflickerGame[];
      } else if (
        rawData &&
        typeof rawData === "object" &&
        "games" in rawData &&
        Array.isArray(rawData.games)
      ) {
        return rawData.games as FleaflickerGame[];
      } else {
        console.error("Unexpected Fleaflicker API response format:", rawData);
        throw new Error("Unexpected response format from Fleaflicker API");
      }
    } catch (error) {
      console.error("Error fetching fleaflicker matchups:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        // Note: rawData might not be in scope here, so we'll just log the error
      }
      throw new Error(
        `Failed to fetch or validate Fleaflicker matchups: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async fetchRoster(
    externalLeagueId: string,
    externalTeamId: string,
    season: number,
    week: number,
  ): Promise<any> {
    await ApiTrackingService.trackApiCall("fleaflicker", "GET teams/roster");
    const url = `https://www.fleaflicker.com/api/FetchRoster?sport=NFL&league_id=${externalLeagueId}&team_id=${externalTeamId}&season=${season}&scoring_period=${week}`;
    return fetchFromUrl(url);
  }

  private processPlayerData(groups: any[]): Player[] {
    const players: Player[] = [];
    groups.forEach((group) => {
      group.slots
        .filter((slot: any) => slot.leaguePlayer)
        .forEach((slot: any) => {
          players.push({
            name: slot.leaguePlayer.proPlayer.nameFull,
            logicalName: slot.leaguePlayer.proPlayer.nameFull
              .toLowerCase()
              .replace(/\s/g, ""),
            team: slot.leaguePlayer.proPlayer.proTeam.abbreviation,
            position: slot.leaguePlayer.proPlayer.position,
            rosterSlotType: group.group === "START" ? "start" : "bench",
          });
        });
    });
    return players;
  }

  private async fetchLeagueStandings(
    externalLeagueId: string,
  ): Promise<FleaflickerLeagueStandings> {
    await ApiTrackingService.trackApiCall(
      "fleaflicker",
      "GET leagues/standings",
    );
    const url = `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${externalLeagueId}`;
    return fetchFromUrl(url);
  }

  private convertGameTeamToFleaflickerTeam(
    gameTeam: FleaflickerGameTeam,
    weekPoints: number,
    weekPointsAgainst: number,
  ): FleaflickerTeam {
    return {
      id: gameTeam.id,
      name: gameTeam.name,
      logoUrl: gameTeam.logo_url || "",
      recordOverall: gameTeam.record_overall
        ? {
            wins: gameTeam.record_overall.wins,
            losses: gameTeam.record_overall.losses,
            ties: gameTeam.record_overall.ties,
            winPercentage: {
              value: gameTeam.record_overall.win_percentage.value,
              formatted: gameTeam.record_overall.win_percentage.formatted,
            },
            rank: gameTeam.record_overall.rank,
            formatted: gameTeam.record_overall.formatted,
          }
        : {
            wins: 0,
            losses: 0,
            ties: 0,
            winPercentage: { value: 0, formatted: "0%" },
            rank: 0,
            formatted: "0-0-0",
          },
      pointsFor: gameTeam.points_for
        ? {
            value: gameTeam.points_for.value,
            formatted: gameTeam.points_for.formatted,
          }
        : { value: 0, formatted: "0" },
      pointsAgainst: gameTeam.points_against
        ? {
            value: gameTeam.points_against.value,
            formatted: gameTeam.points_against.formatted,
          }
        : { value: 0, formatted: "0" },
      owners: [], // Game teams don't include owner info, so we'll use empty array
      weekPoints,
      weekPointsAgainst,
    };
  }
}
