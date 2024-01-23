const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
require("dotenv").config();

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APPID,
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(config);

module.exports = {
  firebaseApp,
  firebaseAuth,
};
