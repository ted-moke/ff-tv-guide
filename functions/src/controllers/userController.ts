import { Request, Response } from "express";
import { admin, db } from "../firebase";
import * as functions from "firebase-functions";

const logger = functions.logger;

export const registerUser = async (req: Request, res: Response) => {
  const { email, username } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    logger.info("Attempting to create user document in Firestore", { uid });
    await db.collection("users").doc(uid).set({
      email,
      username,
      createdAt: new Date(),
      preferences: {},
    });
    logger.info("User document created in Firestore", { uid });

    // Create a custom token for the new user
    const token = await admin.auth().createCustomToken(uid);
    logger.info("Custom token created for user", { uid });

    // Set the token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    res.status(201).send({ 
      uid,
      email,
      username
    });
  } catch (error) {
    logger.error("Error in registerUser", error);
    res.status(400).send({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Create a custom token for the authenticated user
    const token = await admin.auth().createCustomToken(uid);
    logger.info("Custom token created for user", { uid });

    // Set the token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    const userRecord = await admin.auth().getUser(uid);

    res.status(200).send({ 
      uid: userRecord.uid,
      email: userRecord.email,
      username: userRecord.displayName
    });
  } catch (error) {
    logger.error("Error in loginUser", error);
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

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(200).json({ authenticated: false, message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const userRecord = await admin.auth().getUser(uid);

    res.status(200).json({
      authenticated: true,
      uid: userRecord.uid,
      email: userRecord.email,
      username: userRecord.displayName
    });
  } catch (error) {
    res.status(200).json({ authenticated: false, error: "Invalid token" });
  }
};

