const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./project-community-1643c-firebase-adminsdk-96s3g-62089cdeb9.json');

const app = express();
const port = 5500;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();

const firebaseConfig = {
  // ... (your Firebase config)
};

app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errorMessage = [];

  if (!name || !email || !password || !confirmPassword) {
    errorMessage.push('All fields are mandatory.');
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
  ) {
    errorMessage.push(
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one digit.'
    );
  }

  if (password !== confirmPassword) {
    errorMessage.push('Confirm Password must match Password.');
  }

  if (errorMessage.length > 0) {
    res.status(400).json({ error: errorMessage });
  } else {
    try {
      // Register the user in Firebase
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
      });

      console.log('Successfully created new user:', userRecord.uid);

      // Save additional user data to Firestore
      await db.collection('Contributors').doc(userRecord.uid).set({
        name: name,
        email: email,
        password: password, // Note: You may want to hash or omit this for security reasons
      });

      res.json({ success: 'Registration successful!' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const errorMessage = [];

    if (!email || !password) {
        errorMessage.push('Email and password are required.');
        res.status(400).json({ error: errorMessage });
        return;
    }

    try {
        // Check if the user exists in the Contributors collection
        const contributorsRef = db.collection('Contributors');
        const querySnapshot = await contributorsRef.where('email', '==', email).where('password', '==', password).get();

        if (querySnapshot.empty) {
            errorMessage.push('Invalid email or password.');
            res.status(401).json({ error: errorMessage });
        } else {
            // Login successful
            res.json({ success: 'Login successful!' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
