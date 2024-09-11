import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";
import { getSecret } from "./utils/getSecret";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

let dbInstance: admin.firestore.Firestore | null = null;
let adminInstance: typeof admin | null = null;

const initializeFirebase = async () => {
  if (adminInstance) return; // Already initialized

  const serviceAccount = isProduction
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "")
    : await getSecret("firestore_service_acc");

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
  });

  if (process.env.FUNCTIONS_EMULATOR) {
    console.log("Using Firebase emulators");
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  }

  adminInstance = admin;
  dbInstance = admin.firestore();

  // Initialize Firestore collections
  await initializeFirestore();
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
    console.log("using development firebase, no token check");
    return await adminInstance!.auth().verifyIdToken(idToken, true);
  } else {
    return await adminInstance!.auth().verifyIdToken(idToken);
  }
};
