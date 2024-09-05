import { Request, Response } from 'express';
import { db } from '../firebase';
import { League } from '../models/league';

const leaguesCollection = db.collection('leagues');
const platformsCollection = db.collection('platforms');

export const upsertLeague = async (req: Request, res: Response) => {
  const { name, platformId, externalLeagueId } = req.body;

  if (!name || !platformId || !externalLeagueId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const platformDoc = await platformsCollection.doc(platformId).get();
    if (!platformDoc.exists) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    const platform = platformDoc.data();
    const leagueData: League = {
      name,
      platform: { name: platform.name, id: platformId },
      externalLeagueId,
    };

    // Check if a league with the same externalLeagueId already exists
    const existingLeagueQuery = await leaguesCollection
      .where('externalLeagueId', '==', externalLeagueId)
      .limit(1)
      .get();

    if (!existingLeagueQuery.empty) {
      // Update the existing league
      const existingLeagueDoc = existingLeagueQuery.docs[0];
      await existingLeagueDoc.ref.update(leagueData);
      return res.status(200).json({ id: existingLeagueDoc.id, message: 'League updated' });
    } else {
      // Create a new league
      const newDoc = await leaguesCollection.add(leagueData);
      return res.status(201).json({ id: newDoc.id, message: 'League created' });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
