import { Request, Response } from "express";
import { admin, db } from "../firebase";
import * as functions from "firebase-functions";

const logger = functions.logger;

const verifyIdToken = async (idToken: string) => {
  if (process.env.FUNCTIONS_EMULATOR) {
    // For emulator, we need to disable token checks
    console.log('verify resp', await admin.auth().verifyIdToken(idToken, true))
    return await admin.auth().verifyIdToken(idToken, true);
  } else {
    console.log('verify resp', await admin.auth().verifyIdToken(idToken))
    return await admin.auth().verifyIdToken(idToken);
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, username } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    console.log("Attempting to verify ID token");
    console.log("Admin app config:", admin.app().options);
    const decodedToken = await verifyIdToken(idToken);
    console.log("ID token verified successfully", { uid: decodedToken.uid });

    const uid = decodedToken.uid; // Add this line to fix the 'uid' not found errors

    console.log("Fetching all users");
    const listUsersResult = await admin.auth().listUsers();
    console.log("Total users:", listUsersResult.users.length);
    if (listUsersResult.users.length > 0) {
      console.log("First user:", {
        uid: listUsersResult.users[0].uid,
        email: listUsersResult.users[0].email,
        displayName: listUsersResult.users[0].displayName
      });
    } else {
      console.log("No users found");
    }

    logger.info("Attempting to create user document in Firestore", { uid });
    await db.collection("users").doc(uid).set({
      email,
      username,
      createdAt: new Date(),
      preferences: {},
    });
    logger.info("User document created in Firestore", { uid });

    res.status(201).send({ 
      authenticated: true,
      uid,
      email,
      username
    });
  } catch (error) {
    console.error("Error in registerUser", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    res.status(400).send({ authenticated: false, error: (error as Error).message });
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

    const userRecord = await admin.auth().getUser(uid);

    res.status(200).send({ 
      authenticated: true,
      uid: userRecord.uid,
      email: userRecord.email,
      username: userRecord.displayName
    });
  } catch (error) {
    logger.error("Error in loginUser", error);
    res.status(400).send({ authenticated: false, error: (error as Error).message });
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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(200).json({ authenticated: false, message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const userRecord = await admin.auth().getUser(uid);

    // Fetch user data from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    res.status(200).json({
      authenticated: true,
      uid: userRecord.uid,
      email: userRecord.email,
      username: userData?.username || userRecord.displayName
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(200).json({ authenticated: false, error: "Invalid token" });
  }
};

