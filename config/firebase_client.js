// Import the functions you need from the SDKs you need
const firebase = require("firebase");
require("dotenv").config();

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APPID,
};

// Initialize Firebase
firebase.initializeApp(config);

module.exports = firebase;
