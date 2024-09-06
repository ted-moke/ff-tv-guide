import { db } from '../firebase';
import { Platform } from '../models/platform';

const platforms: Platform[] = [
  { id: 'fleaflicker', name: 'Fleaflicker', credentialType: 'email' },
  { id: 'sleeper', name: 'Sleeper', credentialType: 'username' },
  // Add more platforms as needed
];

export const seedDatabase = async () => {
  const platformsCollection = db.collection('platforms');

  for (const platform of platforms) {
    const docRef = platformsCollection.doc(platform.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(platform);
      console.log(`Seeded platform: ${platform.name}`);
    } else {
    }
  }
};