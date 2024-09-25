import { Request, Response } from "express";
import { getDb } from "../firebase";
import { PlatformCredential } from "../models/platformCredential";
import fetchFromUrl from "../utils/fetchFromUrl";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
}

export const createPlatformCredential = async (req: Request, res: Response) => {
  try {
    const data: PlatformCredential = req.body;
    const db = await getDb();
    const collection = db.collection("platformCredentials");

    if (data.platformId === "sleeper") {
      const sleeperUser = await fetchFromUrl(
        `https://api.sleeper.app/v1/user/${data.credential}`,
      );
      data.externalUserId = sleeperUser.user_id;
    }

    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id, ...data });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPlatformCredential = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const db = await getDb();
    const collection = db.collection("platformCredentials");
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("PlatformCredential not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updatePlatformCredential = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<PlatformCredential> = req.body;
    const db = await getDb();
    const collection = db.collection("platformCredentials");
    await collection.doc(id).update(data);
    res.status(200).send("PlatformCredential updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deletePlatformCredential = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const db = await getDb();
    const collection = db.collection("platformCredentials");
    await collection.doc(id).delete();
    res.status(200).send("PlatformCredential deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listPlatformCredentials = async (
  req: Request,
  res: Response,
) => {
  const userId = req.params.uid;
  const db = await getDb();

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const credentialsSnapshot = await db
      .collection("platformCredentials")
      .where("userId", "==", userId)
      .get();

    const credentials = credentialsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(credentials);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};
