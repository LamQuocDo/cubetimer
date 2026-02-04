// firebase_config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBSzMaEoDV36z5-weHYxWrJpBKNy8dCAo4",
  authDomain: "cube-timer-a90d7.firebaseapp.com",
  projectId: "cube-timer-a90d7",
  storageBucket: "cube-timer-a90d7.firebasestorage.app",
  messagingSenderId: "319619971052",
  appId: "1:319619971052:web:3fc4ed3a26e91fa778b2c9",
  measurementId: "G-YDFSDLQDTF",
};

// Init Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
