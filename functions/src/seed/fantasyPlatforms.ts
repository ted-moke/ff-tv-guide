import { db } from "../firebase";
import { FantasyPlatform } from "../models/fantasyPlatform";

const fantasyPlatforms: FantasyPlatform[] = [
  { id: "fleaflicker", displayName: "Fleaflicker", credentialType: "email" },
  { id: "sleeper", displayName: "Sleeper", credentialType: "username" },
];

const seedFantasyPlatforms = async () => {
  const batch = db.batch();
  fantasyPlatforms.forEach((platform) => {
    const docRef = db.collection("fantasyPlatforms").doc(platform.id);
    batch.set(docRef, platform);
  });
  await batch.commit();
  console.log("Fantasy platforms seeded successfully");
};

seedFantasyPlatforms().catch(console.error);
