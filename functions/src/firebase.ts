import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

const serviceAccountPath = path.resolve(
  __dirname,
  "..",
  process.env.SERVICE_ACCOUNT_KEY_PATH || "",
);

if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_KEY_PATH is not defined in the environment");
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
});

if (process.env.FUNCTIONS_EMULATOR) {
  console.log("Using Firebase emulators");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

const db = admin.firestore();

// Function to initialize Firestore collections
const initializeFirestore = async () => {
  try {
    const usersCollection = db.collection("users");
    const usersDoc = await usersCollection.doc("dummy").get();

    if (!usersDoc.exists) {
      // Create a dummy document to ensure the collection exists
      await usersCollection.doc("dummy").set({ dummy: true });

      // Immediately delete the dummy document
      await usersCollection.doc("dummy").delete();
    }
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

// Call the initialization function
initializeFirestore().then(() => {
  console.log('Firestore initialization complete.')
}).catch(console.error);

export { admin, db };
