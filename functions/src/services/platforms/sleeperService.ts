import { db } from "../../firebase";
import { League } from "../../models/league";
import { Team, Player } from "../../models/team";
import https from "https";
import * as fs from "fs";
import * as path from "path";

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
  }: {
    leagueName: string;
    externalLeagueId: string;
    platformCredentialId: string;
  }): Promise<League> {
    console.log(
      "Starting upsert league: ",
      platformCredentialId,
      externalLeagueId,
    );
    const leaguesCollection = db.collection("leagues");
    const leagueData: League = {
      name: leagueName,
      platform: { name: "sleeper", id: platformCredentialId },
      externalLeagueId,
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
      return { id: existingLeagueDoc.id, ...leagueData };
    } else {
      const newLeagueRef = await leaguesCollection.add(leagueData);
      await newLeagueRef.update({ id: newLeagueRef.id });
      return { id: newLeagueRef.id, ...leagueData };
    }
  }

  async upsertTeams(league: League) {
    console.log("Starting upsert teams: ", league.id);
    const week = this.getCurrentWeek();
    const matchups = await this.fetchMatchups(league.externalLeagueId, week);
    const rosters = await this.fetchRosters(league.externalLeagueId);
    const teamsCollection = db.collection("teams");

    // Create a map of roster_id to owner_id
    const rosterOwnerMap = rosters.reduce((acc, roster) => {
      acc[roster.roster_id] = roster.owner_id;
      return acc;
    }, {});

    // Group teams by matchup_id
    const matchupGroups = matchups.reduce((acc, team) => {
      if (!acc[team.matchup_id]) {
        acc[team.matchup_id] = [];
      }
      acc[team.matchup_id].push(team);
      return acc;
    }, {});

    for (const matchupId in matchupGroups) {
      const matchup = matchupGroups[matchupId];
      for (const teamData of matchup) {
        const opponentData = matchup.find(
          (t) => t.roster_id !== teamData.roster_id
        );
        const team: Team = {
          externalTeamId: teamData.roster_id.toString(),
          leagueId: league.id!,
          leagueName: league.name,
          name: `Team ${teamData.roster_id}`, // You might want to fetch actual team names separately
          externalUsername: "", // This information is not available in the matchups data
          externalUserId: rosterOwnerMap[teamData.roster_id] || "", // Set the externalUserId from the roster data
          opponentId: opponentData ? opponentData.roster_id.toString() : "",
          playerData: this.processPlayerData(
            teamData.players,
            teamData.starters
          ),
        };

        // Instead of using externalTeamId as the document ID, let's query for an existing team
        const existingTeamQuery = await teamsCollection
          .where("externalTeamId", "==", team.externalTeamId)
          .where("leagueId", "==", league.id)
          .limit(1)
          .get();

        if (!existingTeamQuery.empty) {
          // Update existing team
          const existingTeamDoc = existingTeamQuery.docs[0];
          await existingTeamDoc.ref.update({...team});
        } else {
          // Create new team with auto-generated ID
          await teamsCollection.add(team);
        }
      }
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
    try {
      console.log(
        "Starting upsert userTeam2:",
        "uid",
        userId,
        "leagueid:",
        league.id,
        "extuid:",
        externalUserId,
      );
      const teamsCollection = db.collection("teams");
      const userTeamsCollection = db.collection("userTeams");

      const teamsQuery = await teamsCollection
        .where("leagueId", "==", league.id)
        .get();
      for (const teamDoc of teamsQuery.docs) {
        const team = teamDoc.data() as Team;
        console.log('checking team:', team.externalUserId)
        if (team.externalUserId === externalUserId) {
          await userTeamsCollection.add({
            userId: userId,
            teamId: teamDoc.id,
          });
          break; // We've found the user's team, no need to continue
        } 
      }
    } catch (error) {
      throw new Error(`Error creating userTeam: ${userId}, ${league.id}`);
    }
  }

  private fetchMatchups(externalLeagueId: string, week: number): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://api.sleeper.app/v1/league/${externalLeagueId}/matchups/${week}`,
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          },
        )
        .on("error", reject);
    });
  }

  private fetchRosters(externalLeagueId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https.get(`https://api.sleeper.app/v1/league/${externalLeagueId}/rosters`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  private processPlayerData(players: string[], starters: string[]): Player[] {
    return players
      .map((playerId) => {
        const playerInfo = this.nflPlayers[playerId];
        if (!playerInfo) {
          console.warn(`Player info not found for ID: ${playerId}`);
          return null;
        }
        return {
          name: playerInfo.full_name,
          logicalName: playerInfo.full_name.toLowerCase().replace(/\s/g, ""),
          team: playerInfo.team,
          position: playerInfo.position,
          rosterSlotType: starters.includes(playerId) ? "start" : "bench",
        };
      })
      .filter((player) => player !== null) as Player[];
  }

  private getCurrentWeek(): number {
    // Implement logic to determine current NFL week
    return 1; // Placeholder
  }
}
