import { Request, Response } from "express";
import { db } from "../firebase";
import { FantasyLeague } from "../models/fantasyLeague";

const collection = db.collection("fantasyLeagues");

export const createFantasyLeague = async (req: Request, res: Response) => {
  try {
    const data: FantasyLeague = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFantasyLeague = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("FantasyLeague not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateFantasyLeague = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<FantasyLeague> = req.body;
    await collection.doc(id).update(data);
    res.status(200).send("FantasyLeague updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteFantasyLeague = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("FantasyLeague deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listFantasyLeagues = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const leagues = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).send(error);
  }
};
