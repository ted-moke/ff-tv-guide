import { v4 as uuidv4 } from 'uuid';

export const generateTempUserId = (): string => {
  return `temp_${uuidv4()}`;
};

import { getDb } from "../firebase";

export const cleanUpTempUsers = async () => {
  const db = await getDb();
  const now = new Date();
  const cutoffDate = new Date(now.setDate(now.getDate() - 30)); // 30 days ago

  const tempUsersQuery = await db.collection("users")
    .where("isTemporary", "==", true)
    .where("createdAt", "<", cutoffDate)
    .get();

  const batch = db.batch();

  tempUsersQuery.forEach(doc => {
    batch.delete(doc.ref);
    // Add logic to clean up associated data if necessary
  });

  await batch.commit();
  console.log("Cleaned up temporary users");
};