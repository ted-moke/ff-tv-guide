import { getDb } from "../firebase";
import { Platform } from "../models/platform";
import { League } from "../models/league";
import { Team } from "../models/team";
import { UserTeam } from "../models/userTeam";

const platforms: Platform[] = [
  { id: "fleaflicker", name: "Fleaflicker", credentialType: "email" },
  { id: "sleeper", name: "Sleeper", credentialType: "username" },
  // Add more platforms as needed
];

export const seedDatabase = async () => {
  const db = await getDb();
  const platformsCollection = db.collection("platforms");

  for (const platform of platforms) {
    const docRef = platformsCollection.doc(platform.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(platform);
      console.log(`Seeded platform: ${platform.name}`);
    }
  }
};

export const seedTestDataForMigration = async () => {
  const db = await getDb();
  
  console.log("Seeding test data for migration...");

  // Create test leagues in the old format (before migration)
  // These will be missing leagueMasterId and season fields
  const testLeagues = [
    {
      name: "Test League 1",
      platform: { id: "sleeper", name: "sleeper" },
      externalLeagueId: Math.random().toString(36).substring(2, 15),
      lastModified: new Date(),
    },
    {
      name: "Test League 2",
      platform: { id: "fleaflicker", name: "fleaflicker" },
      externalLeagueId: Math.random().toString(36).substring(2, 15),
      lastModified: new Date(),
    },
  ];

  const leagueIds: string[] = [];
  
  for (const league of testLeagues) {
    const leagueRef = await db.collection("leagues").add(league);
    leagueIds.push(leagueRef.id);
    console.log(`Created test league: ${league.name} with ID: ${leagueRef.id}`);
  }

  // Create test teams in the old format (missing leagueMasterId and season)
  const testTeams = [
    {
      externalTeamId: "team1",
      leagueId: leagueIds[0],
      externalLeagueId: testLeagues[0].externalLeagueId,
      leagueName: "Test League 1",
      name: "Team Alpha",
      externalUsername: "user1",
      externalUserId: "ext_user1",
      platformId: "sleeper",
      opponentId: null,
      coOwners: [],
      playerData: [],
      stats: { wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
      lastSynced: new Date(),
      lastFetched: new Date(),
    },
    {
      externalTeamId: "team2",
      leagueId: leagueIds[0],
      externalLeagueId: testLeagues[0].externalLeagueId,
      leagueName: "Test League 1",
      name: "Team Beta",
      externalUsername: "user2",
      externalUserId: "ext_user2",
      platformId: "sleeper",
      opponentId: null,
      coOwners: [],
      playerData: [],
      stats: { wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
      lastSynced: new Date(),
      lastFetched: new Date(),
    },
    {
      externalTeamId: "team3",
      leagueId: leagueIds[1],
      externalLeagueId: testLeagues[1].externalLeagueId,
      leagueName: "Test League 1",
      name: "Team Gamma",
      externalUsername: "user3",
      externalUserId: "ext_user3",
      platformId: "sleeper",
      opponentId: null,
      coOwners: [],
      playerData: [],
      stats: { wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
      lastSynced: new Date(),
      lastFetched: new Date(),
    },
  ];

  const teamIds: string[] = [];
  
  for (const team of testTeams) {
    const teamRef = await db.collection("teams").add(team);
    teamIds.push(teamRef.id);
    console.log(`Created test team: ${team.name} with ID: ${teamRef.id}`);
  }

  // Create test user teams in the old format (missing leagueMasterId and currentSeason)
  const testUserTeams = [
    {
      userId: "test-user-1",
      teamId: teamIds[0],
    },
    {
      userId: "test-user-2",
      teamId: teamIds[1],
    },
    {
      userId: "test-user-3",
      teamId: teamIds[2],
    },
  ];

  for (const userTeam of testUserTeams) {
    const userTeamRef = await db.collection("userTeams").add(userTeam);
    console.log(`Created test user team for user: ${userTeam.userId} with ID: ${userTeamRef.id}`);
  }

  console.log("Test data seeding completed!");
  console.log(`Created ${testLeagues.length} leagues, ${testTeams.length} teams, and ${testUserTeams.length} user teams`);
};
