import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import fetch from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';

// Ensure Firebase Admin SDK is initialized
initializeApp();

const db = getFirestore();
const SLEEPER_API_BASE_URL = 'https://api.sleeper.app/v1';

interface FetchSleeperDataMessage {
  leagueId: string;
}

export const fetchSleeperData = functions.pubsub.onMessagePublished('fetchSleeperData', async (message) => {
  console.log("Fetching Sleeper Data");

  // Access the data property and decode it from Base64
  const dataBuffer = Buffer.from(message.data.message.data, 'base64');
  const payload = JSON.parse(dataBuffer.toString()) as FetchSleeperDataMessage;
  const leagueId = payload.leagueId;

  if (!leagueId) {
    console.error('No league ID provided in the message payload.');
    return;
  }

  console.log("League ID: ", leagueId);

  try {
    const response = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: any = await response.json();
    await db.collection('sleeperData').doc(leagueId).set(data);

    console.log('Data successfully fetched and stored.');
  } catch (error) {
    console.error('Error fetching Sleeper data:', error);
  }
}); 