require('dotenv').config();
const functions = require('firebase-functions');

// Example function
exports.myFunction = functions.https.onRequest((request, response) => {
  response.send(`API Key: ${process.env.API_KEY}`);
});