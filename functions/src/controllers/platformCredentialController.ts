import { Request, Response } from "express";
import { db } from "../firebase";
import { PlatformCredential } from "../models/platformCredential";

const collection = db.collection("platformCredentials");

export const createPlatformCredential = async (req: Request, res: Response) => {
  try {
    const data: PlatformCredential = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPlatformCredential = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
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
    await collection.doc(id).update(data);
    res.status(200).send("PlatformCredential updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deletePlatformCredential = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("PlatformCredential deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listPlatformCredentials = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const credentials = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(credentials);
  } catch (error) {
    res.status(500).send(error);
  }
};
