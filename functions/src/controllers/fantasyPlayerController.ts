import { Request, Response } from "express";
import { db } from "../firebase";
import { FantasyPlayer } from "../models/fantasyPlayer";

const collection = db.collection("fantasyPlayers");

export const createFantasyPlayer = async (req: Request, res: Response) => {
  try {
    const data: FantasyPlayer = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFantasyPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("FantasyPlayer not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateFantasyPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<FantasyPlayer> = req.body;
    await collection.doc(id).update(data);
    res.status(200).send("FantasyPlayer updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteFantasyPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("FantasyPlayer deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listFantasyPlayers = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const players = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(players);
  } catch (error) {
    res.status(500).send(error);
  }
};
