// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "mate-to-do",
  "appId": "1:872214843241:web:bd9817a38c1026a4af37f8",
  "storageBucket": "mate-to-do.firebasestorage.app",
  "apiKey": "AIzaSyCMDiCqjDp14OphKKR5_gk6TT6jKK3VAAQ",
  "authDomain": "mate-to-do.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "872214843241"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
