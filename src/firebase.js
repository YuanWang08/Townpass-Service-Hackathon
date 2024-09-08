// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

const fbs = initializeApp(firebaseConfig);
const database = getDatabase(fbs);

export { fbs, database };