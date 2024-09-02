const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      username,
      preferences: {},
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/change-password', async (req, res) => {
  const { uid, newPassword } = req.body;

  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/profile/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(userDoc.data());
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.put('/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const { email, username, preferences } = req.body;

  try {
    await admin.auth().updateUser(uid, { email, displayName: username });
    await db.collection('users').doc(uid).update({ email, username, preferences });

    res.status(200).send({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});