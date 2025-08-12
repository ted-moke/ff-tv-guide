import { Request, Response } from "express";
import { getDb } from "../firebase";
import type { LeagueMaster, League, Team, UserTeam } from "../types/shared";

interface TeamHistoryData {
  leagueMaster: LeagueMaster;
  seasons: {
    season: number;
    league: League;
    team: Team;
    stats: {
      wins: number;
      losses: number;
      ties: number;
      pointsFor: number;
      pointsAgainst: number;
    };
  }[];
}

export const getUserTeamHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const db = await getDb();
    
    // Get user's teams
    const userTeamsSnapshot = await db
      .collection("userTeams")
      .where("userId", "==", userId)
      .get();

    if (userTeamsSnapshot.empty) {
      console.log("No user teams found for user", userId);
      return res.status(200).json({ history: [] });
    }

    const userTeams = userTeamsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as (UserTeam & { id: string })[];

    // Get unique league master IDs
    const leagueMasterIds = [...new Set(userTeams.map(ut => ut.leagueMasterId))];

    console.log("leagueMasterIds", leagueMasterIds);

    // Get all league masters - we need to get them by document ID, not by a field
    const leagueMastersPromises = leagueMasterIds.map(id => 
      db.collection("leagueMasters").doc(id).get()
    );
    const leagueMastersDocs = await Promise.all(leagueMastersPromises);
    const leagueMasters = leagueMastersDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as (LeagueMaster & { id: string })[];

    console.log("leagueMasters", leagueMasters);

    // Get all leagues for these league masters
    const leaguesSnapshot = await db
      .collection("leagues")
      .where("leagueMasterId", "in", leagueMasterIds)
      .get();

    const leagues = leaguesSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as (League & { id: string })[];

    // Get all teams for these leagues
    const leagueIds = leagues.map(l => l.id!);
    const teamsSnapshot = await db
      .collection("teams")
      .where("leagueId", "in", leagueIds)
      .get();

    const teams = teamsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as (Team & { id: string })[];

    // Build the history data structure
    const history: TeamHistoryData[] = [];

    for (const leagueMaster of leagueMasters) {
      const leagueMasterLeagues = leagues.filter(l => l.leagueMasterId === leagueMaster.id);
      const seasons: TeamHistoryData['seasons'] = [];

      console.log("leagueMasterLeagues", leagueMasterLeagues);

      for (const league of leagueMasterLeagues) {
        // Find the user's team for this league
        const userTeam = userTeams.find(ut => ut.leagueMasterId === leagueMaster.id);
        if (!userTeam) {
          console.log("No user team found for league", league.name);
          continue;
        }

        const team = teams.find(t => t.id === userTeam.teamId && t.leagueId === league.id);
        if (!team) {
          console.log("No team found for league", league.name);
          continue;
        }

        seasons.push({
          season: league.season,
          league,
          team,
          stats: team.stats,
        });
      }

      // Sort seasons by year (descending)
      seasons.sort((a, b) => b.season - a.season);

      if (seasons.length > 0) {
        history.push({
          leagueMaster,
          seasons,
        });
      } else {
        console.log("No seasons found for league master", leagueMaster.name);
      }
    }

    if (history.length === 0) {
      console.log("No history found for user", userId);
      return res.status(200).json({ history: [] });
    }

    // Sort by league master name
    history.sort((a, b) => a.leagueMaster.name.localeCompare(b.leagueMaster.name));

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching user team history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
