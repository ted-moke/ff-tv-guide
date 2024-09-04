import { Request, Response } from 'express';
import { db } from '../firebase';

export const getAllPlatforms = async (req: Request, res: Response) => {
  try {
    const platformsSnapshot = await db.collection('platforms').get();
    const platforms = platformsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
};

export const getPlatformById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const platformDoc = await db.collection('platforms').doc(id).get();
    
    if (!platformDoc.exists) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    res.json({
      id: platformDoc.id,
      ...platformDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platform' });
  }
};