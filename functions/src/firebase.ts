import * as admin from "firebase-admin";
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const serviceAccountPath = path.resolve(__dirname, '..', process.env.SERVICE_ACCOUNT_KEY_PATH || '');

if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_KEY_PATH is not defined in the environment");
}

console.log('serviceAccountPath')
const serviceAccount = require(serviceAccountPath);
console.log('Service account loaded:', {
  project_id: serviceAccount.project_id,
  client_email: serviceAccount.client_email
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  // Remove the authDomain line
});

if (process.env.FUNCTIONS_EMULATOR) {
  console.log("Using Firebase emulators");
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

const db = admin.firestore();

// Function to get and log app information
const logAppInfo = () => {
  const app = admin.app();
  console.log('Firebase Admin App Information:', {
    name: app.name,
    projectId: app.options.projectId,
    storageBucket: app.options.storageBucket,
    databaseURL: app.options.databaseURL
  });
};

// Call logAppInfo after initialization
logAppInfo();

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
