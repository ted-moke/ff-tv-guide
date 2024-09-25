import { Request, Response } from "express";
import { getAdmin, getDb, verifyIdToken } from "../firebase";
import { generateTempUserId } from "../utils/tempUser";

export const registerUser = async (req: Request, res: Response) => {
  const { email, username, isTemporary } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  let uid: string;
  let derivedEmail = email;
  if (isTemporary) {
    uid = generateTempUserId();
    derivedEmail = `temp-${uid}@example.com`;
  } else {
    if (!idToken) {
      return res.status(401).send({ error: "No token provided" });
    }

    const decodedToken = await verifyIdToken(idToken);
    uid = decodedToken.uid;
  }

  try {
    const db = await getDb();

    // Check if a user with the same username already exists
    const usernameQuery = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!usernameQuery.empty) {
      return res
        .status(400)
        .send({ error: "User with the same username already exists" });
    }

    // If an email is provided, check if a user with the same email already exists
    const emailQuery = await db
      .collection("users")
      .where("email", "==", derivedEmail)
      .get();
    if (!emailQuery.empty) {
      return res
        .status(400)
        .send({ error: "User with the same email already exists" });
    }

    console.log("Attempting to create user document in Firestore", { uid });
    const newUser = {
      uid,
      email: derivedEmail,
      username,
      createdAt: new Date(),
      preferences: {},
      isTemporary,
    };
    await db.collection("users").doc(uid).set(newUser);
    console.log("User document created in Firestore", { uid });

    res.status(201).send({
      ...newUser,
      authenticated: true,
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

export const convertTempUser = async (req: Request, res: Response) => {
  const { id: tempUserId, email, username, password } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decodedToken = await verifyIdToken(idToken);
    const newUserId = decodedToken.uid;

    const db = await getDb();

    // Check if a user with the same username already exists
    const usernameQuery = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!usernameQuery.empty) {
      return res
        .status(400)
        .send({ error: "User with the same username already exists" });
    }

    // Check if a user with the same email already exists
    const emailQuery = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!emailQuery.empty) {
      return res
        .status(400)
        .send({ error: "User with the same email already exists" });
    }

    // Copy user data from temp user to new user
    const tempUserDoc = await db.collection("users").doc(tempUserId).get();
    if (!tempUserDoc.exists) {
      return res.status(404).send({ error: "Temporary user not found" });
    }

    const tempUserData = tempUserDoc.data();
    const newUserData = {
      id: newUserId,
      email,
      username,
      createdAt: tempUserData?.createdAt,
      preferences: tempUserData?.preferences,
      isTemporary: false,
    };
    const newUserDoc = await db
      .collection("users")
      .doc(newUserId)
      .set(newUserData);

    // Copy platform credentials
    const platformCredentialsSnapshot = await db
      .collection("platformCredentials")
      .where("userId", "==", tempUserId)
      .get();

    const batch = db.batch();
    platformCredentialsSnapshot.forEach((doc) => {
      const data = doc.data();
      const newDocRef = db.collection("platformCredentials").doc();
      batch.set(newDocRef, { ...data, userId: newUserId });
    });

    // Copy user teams
    const userTeamsSnapshot = await db
      .collection("userTeams")
      .where("userId", "==", tempUserId)
      .get();

    userTeamsSnapshot.forEach((doc) => {
      const data = doc.data();
      const newDocRef = db.collection("userTeams").doc();
      batch.set(newDocRef, { ...data, userId: newUserId });
    });

    await batch.commit();

    // Delete temp user
    await db.collection("users").doc(tempUserId).delete();

    res.status(201).send({ ...newUserData, authenticated: true });
  } catch (error) {
    console.error("Error in convertTempUser", error);
    res.status(500).send({ error: (error as Error).message });
  }
};
