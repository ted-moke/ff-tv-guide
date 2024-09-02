import { Request, Response } from "express";
import { admin, db } from "../firebase";
import * as functions from "firebase-functions";

const logger = functions.logger;

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    logger.info("Attempting to create user", { email, username });
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    logger.info("User created successfully", { uid: userRecord.uid });

    try {
      logger.info("Attempting to create user document in Firestore", { uid: userRecord.uid });
      await db.collection("users").doc(userRecord.uid).set({
        username,
        preferences: {},
      });
      logger.info("User document created in Firestore", { uid: userRecord.uid });
    } catch (firestoreError) {
      logger.error("Error creating user document in Firestore", firestoreError);
      // If Firestore operation fails, delete the created Auth user
      await admin.auth().deleteUser(userRecord.uid);
      throw firestoreError;
    }

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    logger.error("Error in registerUser", error);
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error: (error as Error).message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { uid, newPassword } = req.body;

  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).send({ error: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send(userDoc.data());
  } catch (error) {
    
    res.status(400).send({ error: (error as Error).message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { email, username, preferences } = req.body;

  try {
    await admin.auth().updateUser(uid, { email, displayName: username });
    await db
      .collection("users")
      .doc(uid)
      .update({ email, username, preferences });

    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).send({ error: (error as Error).message });
  }
};
