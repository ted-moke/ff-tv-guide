import { getDb } from "../../firebase";
import { League } from "../../models/league";
import { Team, Player } from "../../models/team";
import https from "https";
import {
  FleaflickerLeagueStandings,
  FleaflickerTeam,
  Owner,
} from "../../types/fleaflickerTypes";
import { getCurrentWeek } from "../../utils/getCurrentWeek";

export class FleaflickerService {
  async upsertLeague({
    leagueName,
    externalLeagueId,
    platformCredentialId,
  }: {
    leagueName: string;
    externalLeagueId: string;
    platformCredentialId: string;
  }): Promise<League> {
    console.log("FF Upserting league");
    const db = await getDb();
    const leaguesCollection = db.collection("leagues");
    const leagueData: League = {
      name: leagueName,
      platform: { name: "fleaflicker", id: platformCredentialId },
      externalLeagueId,
    };

    console.log("External league ID", externalLeagueId);
    const existingLeagueQuery = await leaguesCollection
      .where("externalLeagueId", "==", externalLeagueId)
      .limit(1)
      .get();

    console.log("Existing league query", existingLeagueQuery.empty);

    if (!existingLeagueQuery.empty) {
      console.log("League already exists");
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      await existingLeagueDoc.ref.update({ ...leagueData });
      return { id: existingLeagueDoc.id, ...leagueData };
    } else {
      console.log("League does not exist");
      const newLeagueRef = await leaguesCollection.add(leagueData);
      return { id: newLeagueRef.id, ...leagueData };
    }
  }

  async upsertTeams(league: League) {
    try {
      console.log("FF Upserting teams");
      const db = await getDb();
      const week = getCurrentWeek();
      const season = this.getCurrentSeason();
      const matchups = await this.fetchMatchups(
        league.externalLeagueId,
        week,
        season,
      );
      const teamsCollection = db.collection("teams");

      // Fetch league standings to get owner IDs
      const leagueStandings = await this.fetchLeagueStandings(
        league.externalLeagueId,
      );
      const teamOwners = new Map<string, Owner>(
        leagueStandings.divisions.flatMap((division) =>
          division.teams.map((team) => [team.id.toString(), team.owners[0]]),
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
        const owner = teamOwners.get(teamData.id.toString());
        const team: Team = {
          externalTeamId: teamData.id.toString(),
          leagueId: league.id!,
          leagueName: league.name,
          name: teamData.name,
          externalUsername: owner ? owner.displayName : rosterData.ownerName,
          externalUserId: owner
            ? owner.id.toString()
            : rosterData.ownerId.toString(),
          opponentId: opponentId,
          playerData: this.processPlayerData(rosterData.groups),
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

      for (const matchup of matchups) {
        await addAndUpdateTeam(matchup.away, matchup.home.id);
        await addAndUpdateTeam(matchup.home, matchup.away.id);
      }
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
    console.log(
      "Upserting user teams",
      league.id,
      externalUserId,
      externalTeamId,
      userId,
    );
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
        await userTeamsCollection.add({
          userId: userId,
          teamId: teamDoc.id, // Use the internal team document ID
          leagueId: league.id,
        });

        break; // We've found the user's team, no need to continue
      }
    }
  }

  private async fetchMatchups(
    externalLeagueId: string,
    week: number,
    season: number,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://www.fleaflicker.com/api/FetchLeagueScoreboard?league_id=${externalLeagueId}&season=${season}&scoring_period=${week}`,
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data).games));
          },
        )
        .on("error", reject);
    });
  }

  private async fetchRoster(
    externalLeagueId: string,
    externalTeamId: string,
    season: number,
    week: number,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://www.fleaflicker.com/api/FetchRoster?sport=NFL&league_id=${externalLeagueId}&team_id=${externalTeamId}&season=${season}&scoring_period=${week}`,
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          },
        )
        .on("error", reject);
    });
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
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://www.fleaflicker.com/api/FetchLeagueStandings?sport=NFL&league_id=${externalLeagueId}`,
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          },
        )
        .on("error", reject);
    });
  }

  private getCurrentSeason(): number {
    // Implement logic to determine current NFL season
    return 2024; // Placeholder
  }
}
