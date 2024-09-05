okay, there is going to be upsert league and team flows for each platform. right now we only have 2 platforms but it could be more like 4-8 in the near future. each will need unique endpoints and logic to integrate with how the platforms api is structured. how can we keep the api entry point relatively simply, and the chain of logic afterwards scalable while also ending up with consistent data models after the syncs are complete. i want to be very planned out for this. for now the input and high level flows are very similar, but the way we go about upserting teams differs quite a bit. this is what i'm thinking


### Upsert league (sleeper)
1. input: leagueName, externalLeagueId, platformCredentialId
2. upsert league
3. upsert teams
4. upsert userTeams

### Upsert league (ff)
1. input: leagueName, externalLeagueId, externalTeamId?, platformCredentialId
2. upsert league
3. upsert teams
4. upsert userTeams

### Upsert teams (sleeper)
1. input: externalLeagueId, week
2. pull player data from `./seed/nflPlayers.json` into memory dict nflPlayers
3. Fetch matchups for the week from `https://api.sleeper.app/v1/league/{externalLeagueId}/matchups/{week}`
4. For each team
   1. Upsert team resource in teams collection
      1. for player id in starters array
         1. associate player id with player info from nflPlayers
         2. pull relevant player data (i.e. build to the model) out of nflPlayers
         3. set player rosterSlotType with starter if in starters array, otherwise set to bench
      3. set team externalUsername
      4. set team externalUserId (from platformCredentialId)
      5. set team opponentId
      6. set team leagueId
      7. set team leagueName
      8. set externalTeamId

### Upsert user<>team (sleeper)
1. input: externalLeagueId, userId
2. upsert user<>team resource with userId and teamId


### Upsert teams (ff)
1. Take externalLeagueId, week, season
2. Fetch matchups from `https://www.fleaflicker.com/api/FetchLeagueScoreboard?league_id={externalLeagueId}&season={year}&scoring_period={week}`
3. For each matchup
   1. For each team
      1. Pull opponentId from the matchup
      2. Fetch team data (using team id from the matchup) from `https://www.fleaflicker.com/api/FetchRoster?sport=NFL&league_id={externalLeagueId}&team_id={externalTeamId}&season={season}&scoring_period={week}`
      3. For group in groups
         1. For player in slots
            1. Pull relevant player data out of lineups
            2. set player rosterSlotType based on the group
      4. Set team name
      5. Set externalTeamId
      6. Set leagueId
      7. Set leagueName
      8. Store in teams collection

### Upsert user<>team (ff)
1. input: externalTeamId, userId
2. upsert user<>team resource with userId and teamId
