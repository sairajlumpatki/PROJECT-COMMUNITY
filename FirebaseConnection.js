var admin = require("firebase-admin");

var serviceAccount = require("project-community-1643c-firebase-adminsdk-96s3g-62089cdeb9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// C:\Users\DELL\Downloads\