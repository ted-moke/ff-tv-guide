import { Request, Response } from "express";
import { getDb } from "../firebase";

export const getAllPlatforms = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const platformsSnapshot = await db.collection("platforms").get();
    const platforms = platformsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(platforms);
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch platforms" });
  }
};

export const getPlatformById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const platformDoc = await db.collection("platforms").doc(id).get();

    if (!platformDoc.exists) {
      return res.status(404).json({ error: "Platform not found" });
    }

    res.json({
      id: platformDoc.id,
      ...platformDoc.data(),
    });
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch platform" });
  }
};
