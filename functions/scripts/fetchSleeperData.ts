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

const START_DATE = Date.now();
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const fetchSleeperData = functions.pubsub.onMessagePublished('fetchSleeperData', async (message) => {
  // Check if 7 days have passed
  if (Date.now() - START_DATE > SEVEN_DAYS) {
    console.log('7 days have passed, stopping data collection');
    return;
  }

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
    const winnersBracketResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}/winners_bracket`);
    const transactionsResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}/transactions/${week}`);
    const tradedPicksResponse = await fetch(`${SLEEPER_API_BASE_URL}/league/${leagueId}/traded_picks`);
    const nflStateResponse = await fetch(`${SLEEPER_API_BASE_URL}/state/nfl`);

    if (!leagueResponse.ok || !weekResponse.ok || !rostersResponse.ok || 
        !winnersBracketResponse.ok || !transactionsResponse.ok || 
        !tradedPicksResponse.ok || !nflStateResponse.ok) {
      throw new Error('Failed to fetch data from one or more endpoints');
    }

    const leagueData: any = await leagueResponse.json();
    const weekData: any = await weekResponse.json();
    const rostersData: any = await rostersResponse.json();
    const winnersBracketData: any = await winnersBracketResponse.json();
    const transactionsData: any = await transactionsResponse.json();
    const tradedPicksData: any = await tradedPicksResponse.json();
    const nflStateData: any = await nflStateResponse.json();

    const timestamp = Date.now();
    const datetime = new Date(timestamp).toISOString();

    await db.collection('sleeperData').add({
      leagueData,
      weekData,
      rostersData,
      winnersBracketData,
      transactionsData,
      tradedPicksData,
      nflStateData,
      metadata: {
        leagueId,
        week,
        sport: 'nfl',
        timestamp,
        datetime,
        fetchedAt: datetime,
      }
    });

    console.log('Data successfully fetched and stored.');
  } catch (error) {
    console.error('Error fetching Sleeper data:', error);
  }
}); 