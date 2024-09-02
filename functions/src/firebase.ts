import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_KEY_PATH is not defined");
}

console.log(`Reading service account key from: ${serviceAccountPath}`);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || undefined, // Use default if not provided
});

const db = admin.firestore();

export { admin, db };
