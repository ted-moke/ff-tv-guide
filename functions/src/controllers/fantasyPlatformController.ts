import { Request, Response } from "express";
import { db } from "../firebase";
import { FantasyPlatform } from "../models/fantasyPlatform";

const collection = db.collection("fantasyPlatforms");

export const createFantasyPlatform = async (req: Request, res: Response) => {
  try {
    const data: FantasyPlatform = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFantasyPlatform = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("FantasyPlatform not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateFantasyPlatform = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<FantasyPlatform> = req.body;
    await collection.doc(id).update(data);
    res.status(200).send("FantasyPlatform updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteFantasyPlatform = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("FantasyPlatform deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listFantasyPlatforms = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const platforms = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).send(error);
  }
};
