import { db } from '../../firebase';
import { League } from '../../models/league';

export class SleeperService {
  async upsertLeague({ leagueName, externalLeagueId, platformCredentialId }: { leagueName: string, externalLeagueId: string, platformCredentialId: string }) {
    // Upsert league logic for Sleeper
    const leaguesCollection = db.collection('leagues');
    const leagueData: League = { name: leagueName, platform: { name: 'sleeper', id: platformCredentialId }, externalLeagueId };
    const existingLeagueQuery = await leaguesCollection.where('externalLeagueId', '==', externalLeagueId).limit(1).get();

    if (!existingLeagueQuery.empty) {
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      await existingLeagueDoc.ref.update(leagueData);
    } else {
      await leaguesCollection.add(leagueData);
    }

    // Upsert teams and userTeams logic
  }
}