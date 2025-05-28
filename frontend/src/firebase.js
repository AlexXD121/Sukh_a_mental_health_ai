// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIyC8XvefIAwa-Kyo8pm4EonOC_JVLG5I",
  authDomain: "sukh-24556.firebaseapp.com",
  projectId: "sukh-24556",
  storageBucket: "sukh-24556.appspot.com",
  messagingSenderId: "445824134979",
  appId: "1:445824134979:web:5a810f317e40b0df67c9f6",
  measurementId: "G-0K5WFWG29T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
