import { Request, Response } from "express";
import { getAdmin, getDb, verifyIdToken } from "../firebase";

export const registerUser = async (req: Request, res: Response) => {
  const { email, username } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decodedToken = await verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const db = await getDb();
    console.log("Attempting to create user document in Firestore", { uid });
    await db.collection("users").doc(uid).set({
      email,
      username,
      createdAt: new Date(),
      preferences: {},
    });
    console.log("User document created in Firestore", { uid });

    res.status(201).send({
      authenticated: true,
      uid,
      email,
      username,
    });
  } catch (error) {
    console.error("Error in registerUser", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    res
      .status(400)
      .send({ authenticated: false, error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).send({ error: "No token provided" });
    }

    const decodedToken = await verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const admin = await getAdmin();
    const userRecord = await admin.auth().getUser(uid);

    res.status(200).send({
      authenticated: true,
      uid: userRecord.uid,
      email: userRecord.email,
      username: userRecord.displayName,
    });
  } catch (error) {
    console.error("Error in loginUser", error);
    res
      .status(400)
      .send({ authenticated: false, error: (error as Error).message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { uid, newPassword } = req.body;

  try {
    const admin = await getAdmin();
    await admin.auth().updateUser(uid, { password: newPassword });
    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).send({ error: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const db = await getDb();
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
    const admin = await getAdmin();
    const db = await getDb();
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
  try {
    const admin = await getAdmin();
    const db = await getDb();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(200)
        .json({ authenticated: false, message: "No token provided" });
    }

    const decodedToken = await verifyIdToken(token);
    const uid = decodedToken.uid;
    const userRecord = await admin.auth().getUser(uid);

    // Fetch user data from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    res.status(200).json({
      authenticated: true,
      uid: userRecord.uid,
      email: userRecord.email,
      username: userData?.username || userRecord.displayName,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(200).json({ authenticated: false, error: "Invalid token" });
  }
};