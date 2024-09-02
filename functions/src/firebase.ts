import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_KEY_PATH is not defined");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || undefined, // Use default if not provided
});

const db = admin.firestore();

// Function to initialize Firestore collections
const initializeFirestore = async () => {
  try {
    const usersCollection = db.collection('users');
    const usersDoc = await usersCollection.doc('dummy').get();
    
    if (!usersDoc.exists) {
      // Create a dummy document to ensure the collection exists
      await usersCollection.doc('dummy').set({ dummy: true });
      console.log("'users' collection created successfully");
      
      // Immediately delete the dummy document
      await usersCollection.doc('dummy').delete();
      console.log("Dummy document deleted");
    } else {
      console.log("'users' collection already exists");
    }
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

// Call the initialization function
initializeFirestore().catch(console.error);

export { admin, db };
