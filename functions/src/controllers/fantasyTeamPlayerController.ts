import { Request, Response } from "express";
import { db } from "../firebase";
import { FantasyTeamPlayer } from "../models/fantasyTeamPlayer";

const collection = db.collection("fantasyTeamPlayers");

export const createFantasyTeamPlayer = async (req: Request, res: Response) => {
  try {
    const data: FantasyTeamPlayer = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFantasyTeamPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("FantasyTeamPlayer not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateFantasyTeamPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<FantasyTeamPlayer> = req.body;
    await collection.doc(id).update(data);
    res.status(200).send("FantasyTeamPlayer updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteFantasyTeamPlayer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("FantasyTeamPlayer deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listFantasyTeamPlayers = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const teamPlayers = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(teamPlayers);
  } catch (error) {
    res.status(500).send(error);
  }
};
