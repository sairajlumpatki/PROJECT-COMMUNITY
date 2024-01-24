const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./project-community-1643c-firebase-adminsdk-96s3g-62089cdeb9.json'); // Update with your own service account key

const app = express();
const port = 5500;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: "AIzaSyCCvwJRoh0LbxMGTzU5T_E7S_g-rF3zFiE",
    authDomain: "project-community-1643c.firebaseapp.com",
    projectId: "project-community-1643c",
    storageBucket: "project-community-1643c.appspot.com",
    messagingSenderId: "178142102762",
    appId: "1:178142102762:web:82473a9f6f6b56c0ccc393",
    measurementId: "G-2C1TQS1MC8"
  };

app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errorMessage = [];

  if (!name || !email || !password || !confirmPassword) {
    errorMessage.push('All fields are mandatory.');
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
    errorMessage.push('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one digit.');
  }

  if (password !== confirmPassword) {
    errorMessage.push('Confirm Password must match Password.');
  }

  if (errorMessage.length > 0) {
    res.status(400).json({ error: errorMessage });
  } else {
    try {
      // Register the user in Firebase (update with your own logic)
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
      });

      console.log('Successfully created new user:', userRecord.uid);

      // You can also save additional user data to Firestore or Realtime Database

      res.json({ success: 'Registration successful!' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
