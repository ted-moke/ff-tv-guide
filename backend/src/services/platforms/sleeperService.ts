import { getDb } from "../../firebase";
import { League } from "../../models/league";
import { Team, Player } from "../../models/team";
import { getCurrentWeek } from "../../utils/getCurrentWeek";
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
    const db = await getDb();
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
      return { ...leagueData, id: existingLeagueDoc.id };
    } else {
      const newLeagueRef = await leaguesCollection.add(leagueData);
      await newLeagueRef.update({ id: newLeagueRef.id });
      return { ...leagueData, id: newLeagueRef.id };
    }
  }

  async upsertTeams(league: League) {
    const db = await getDb();
    const week = getCurrentWeek();
    const matchups = await this.fetchMatchups(league.externalLeagueId, week);
    const rosters = await this.fetchRosters(league.externalLeagueId);
    const teamsCollection = db.collection("teams");

    // Create a map of roster_id to owner_id
    const rosterOwnerMap = rosters.reduce(
      (acc: { [key: string]: string }, roster: any) => {
        acc[roster.roster_id] = roster.owner_id;
        return acc;
      },
      {},
    );

    // Group teams by matchup_id
    const matchupGroups = matchups.reduce(
      (acc: { [key: string]: any[] }, team: any) => {
        if (!acc[team.matchup_id]) {
          acc[team.matchup_id] = [];
        }
        acc[team.matchup_id].push(team);
        return acc;
      },
      {},
    );

    for (const matchupId in matchupGroups) {
      const matchup = matchupGroups[matchupId];
      for (const teamData of matchup) {
        const opponentData = matchup.find(
          (t: any) => t.roster_id !== teamData.roster_id,
        );
        const team: Team = {
          externalTeamId: teamData.roster_id.toString(),
          leagueId: league.id || "",
          leagueName: league.name,
          name: `Team ${teamData.roster_id}`, // You might want to fetch actual team names separately
          externalUsername: "", // This information is not available in the matchups data
          externalUserId: rosterOwnerMap[teamData.roster_id] || "", // Set the externalUserId from the roster data
          opponentId: opponentData ? opponentData.roster_id.toString() : "",
          playerData: this.processPlayerData(
            teamData.players,
            teamData.starters,
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
          await existingTeamDoc.ref.update({ ...team, id: existingTeamDoc.id });
        } else {
          // Create new team with auto-generated ID
          const newTeamRef = await teamsCollection.add(team);
          await newTeamRef.update({ id: newTeamRef.id });
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
    const url = `https://api.sleeper.app/v1/league/${externalLeagueId}/matchups/${week}`;
    console.log("Fetching matchups from Sleeper", url);
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(JSON.parse(data)));
        })
        .on("error", reject);
    });
  }

  private fetchRosters(externalLeagueId: string): Promise<any> {
    const url = `https://api.sleeper.app/v1/league/${externalLeagueId}/rosters`;
    console.log("Fetching rosters from Sleeper", url);
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(JSON.parse(data)));
        })
        .on("error", reject);
    });
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
          return {
            name: playerInfo.full_name,
            logicalName: playerInfo.full_name.toLowerCase().replace(/\s/g, ""),
            team: playerInfo.team,
            position: playerInfo.position,
            rosterSlotType: starters.includes(playerId) ? "start" : "bench",
          };
        } catch (error) {
          console.error(`Error processing player with ID ${playerId}:`, error);
          return null;
        }
      })
      .filter((player) => player !== null) as Player[];
  }
}