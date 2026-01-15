import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2X4wjMpvqWrwWTdIYTrifZflVgmS4-04",
  authDomain: "mis15-paloma.firebaseapp.com",
  projectId: "mis15-paloma",
  storageBucket: "mis15-paloma.firebasestorage.app",
  messagingSenderId: "111100569416",
  appId: "1:111100569416:web:c16f7dff582fc54f1b757d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
