import { getDb } from "../../firebase";
import { League } from "../../models/league";
import { Team, Player } from "../../models/team";
import https from "https";

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
    const existingLeagueQuery = await leaguesCollection
      .where("externalLeagueId", "==", externalLeagueId)
      .limit(1)
      .get();

    if (!existingLeagueQuery.empty) {
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      await existingLeagueDoc.ref.update({ ...leagueData });
      return { id: existingLeagueDoc.id, ...leagueData };
    } else {
      const newLeagueRef = await leaguesCollection.add(leagueData);
      return { id: newLeagueRef.id, ...leagueData };
    }
  }

  async upsertTeams(league: League) {
    try {
      console.log("FF Upserting teams");
      const db = await getDb();
      const week = this.getCurrentWeek();
      const season = this.getCurrentSeason();
      const matchups = await this.fetchMatchups(
        league.externalLeagueId,
        week,
        season,
      );
      const teamsCollection = db.collection("teams");

      const addAndUpdateTeam = async (teamData: any, opponentId: string) => {
        // console.log("FF Upserting team", teamData.id);
        const rosterData = await this.fetchRoster(
          league.externalLeagueId,
          teamData.id,
          season,
          week,
        );
        // console.log("FF Roster data", rosterData);
        const team: Team = {
          externalTeamId: teamData.id,
          leagueId: league.id!,
          leagueName: league.name,
          name: teamData.name,
          externalUsername: rosterData.ownerName,
          externalUserId: rosterData.ownerId.toString(), // Store the Fleaflicker owner ID
          opponentId: opponentId,
          playerData: this.processPlayerData(rosterData.groups),
        };

        await teamsCollection
          .doc(team.externalTeamId)
          .set(team, { merge: true });
      };

      for (const matchup of matchups) {
        console.log("FF Matchup", matchups);

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
    userId,
  }: {
    league: League;
    externalUserId: string;
    userId: string;
  }) {
    console.log("Upserting userTeams");
    const db = await getDb();
    const teamsCollection = db.collection("teams");
    const userTeamsCollection = db.collection("userTeams");

    const teamsQuery = await teamsCollection
      .where("leagueId", "==", league.id)
      .get();
    for (const teamDoc of teamsQuery.docs) {
      const team = teamDoc.data() as Team;
      if (team.externalUserId === externalUserId) {
        await userTeamsCollection.add({
          userId: userId,
          teamId: teamDoc.id, // Use the internal team document ID
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
    return groups.flatMap((group: any) =>
      group.slots.map((slot: any) => ({
        name: slot.player.proPlayer.nameFull,
        logicalName: slot.player.proPlayer.nameFull
          .toLowerCase()
          .replace(/\s/g, ""),
        team: slot.player.proPlayer.nflTeam,
        position: slot.player.proPlayer.position,
        rosterSlotType: group.group === "START" ? "start" : "bench",
      })),
    );
  }

  private getCurrentWeek(): number {
    // Implement logic to determine current NFL week
    return 1; // Placeholder
  }

  private getCurrentSeason(): number {
    // Implement logic to determine current NFL season
    return 2024; // Placeholder
  }
}
