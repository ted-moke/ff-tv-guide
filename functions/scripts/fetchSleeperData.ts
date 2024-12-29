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
  week: number;
}

export const fetchSleeperData = functions.pubsub.onMessagePublished('fetchSleeperData', async (message) => {
  console.log("Fetching Sleeper Data");

  // Access the data property and decode it from Base64
  const dataBuffer = Buffer.from(message.data.message.data, 'base64');
  const payload = JSON.parse(dataBuffer.toString()) as FetchSleeperDataMessage;
  const { leagueId, week } = payload;

  if (!leagueId || !week) {
    console.error('League ID or week not provided in the message payload.');
    return;
  }

  console.log("League ID: ", leagueId);
  console.log("Week: ", week);

  try {
    // Call multiple endpoints
    const leagueResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}`);
    const weekResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}/matchups/${week}`);
    const rostersResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}/rosters`);

    if (!leagueResponse.ok || !weekResponse.ok || !rostersResponse.ok) {
      throw new Error(`Failed to fetch data: ${leagueResponse.statusText}, ${weekResponse.statusText}, or ${rostersResponse.statusText}`);
    }

    const leagueData: any = await leagueResponse.json();
    const weekData: any = await weekResponse.json();
    const rostersData: any = await rostersResponse.json();

    await db.collection('sleeperData').doc(leagueId).set({ leagueData, weekData, rostersData });

    console.log('Data successfully fetched and stored.');
  } catch (error) {
    console.error('Error fetching Sleeper data:', error);
  }
}); 