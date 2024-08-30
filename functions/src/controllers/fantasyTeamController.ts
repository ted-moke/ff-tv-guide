import { Request, Response } from "express";
import { db } from "../firebase";
import { FantasyTeam } from "../models/fantasyTeam";

const collection = db.collection("fantasyTeams");

export const createFantasyTeam = async (req: Request, res: Response) => {
  try {
    const data: FantasyTeam = req.body;
    const newDoc = await collection.add(data);
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFantasyTeam = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("FantasyTeam not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateFantasyTeam = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: Partial<FantasyTeam> = req.body;
    await collection.doc(id).update(data);
    res.status(200).send("FantasyTeam updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteFantasyTeam = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.doc(id).delete();
    res.status(200).send("FantasyTeam deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listFantasyTeams = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const teams = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).send(error);
  }
};
