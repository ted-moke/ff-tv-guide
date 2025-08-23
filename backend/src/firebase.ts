import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";
import { getSecret } from "./utils/getSecret";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

// Set emulator environment variables for development
if (!isProduction) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

let dbInstance: admin.firestore.Firestore | null = null;
let adminInstance: typeof admin | null = null;

const initializeFirebase = async () => {
  try {
    if (adminInstance) return; // Already initialized
    console.log("Initializing Firebase. Production: ", isProduction);
    console.log("Emulator hosts:", {
      FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
      FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST
    });

    if (isProduction) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORAGE_BUCKET,
      });
    } else {
      // Development mode - use emulator
      console.log("Initializing Firebase Admin with emulator");
      admin.initializeApp({
        projectId: "fantasy-tv-guide",
      });
    }

    adminInstance = admin;
    dbInstance = admin.firestore();

    // Initialize Firestore collections
    await initializeFirestore();
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
};

const initializeFirestore = async () => {
  if (!dbInstance) throw new Error("Firestore not initialized");

  try {
    const usersCollection = dbInstance.collection("users");
    const usersDoc = await usersCollection.doc("dummy").get();

    if (!usersDoc.exists) {
      await usersCollection.doc("dummy").set({ dummy: true });
      await usersCollection.doc("dummy").delete();
    }
    console.log("Firestore initialization complete.");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

export const getAdmin = async () => {
  await initializeFirebase();
  return adminInstance!;
};

export const getDb = async () => {
  await initializeFirebase();
  return dbInstance!;
};

export const verifyIdToken = async (idToken: string) => {
  await initializeFirebase();
  if (process.env.NODE_ENV !== "production") {
    console.log("Verifying id token in development");
    try {
      return await adminInstance!.auth().verifyIdToken(idToken, true);
    } catch (error) {
      console.error("Error verifying token in development:", error);
      throw error;
    }
  } else {
    return await adminInstance!.auth().verifyIdToken(idToken);
  }
};
