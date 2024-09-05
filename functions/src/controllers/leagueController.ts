import { Request, Response } from 'express';
import { PlatformServiceFactory } from '../services/platforms/platformServiceFactory';

export const upsertLeague = async (req: Request, res: Response) => {
  const { leagueName, externalLeagueId, platformCredentialId, platformId } = req.body;

  if (!leagueName || !externalLeagueId || !platformCredentialId || !platformId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const platformService = PlatformServiceFactory.getService(platformId);
    await platformService.upsertLeague({ leagueName, externalLeagueId, platformCredentialId });
    res.status(200).json({ message: 'League upserted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
