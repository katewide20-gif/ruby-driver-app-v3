import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXJOwGuQ4UVFHh229OMQIQEXyUhv59T-E",
  authDomain: "ruby-54b40.firebaseapp.com",
  projectId: "ruby-54b40",
  storageBucket: "ruby-54b40.firebasestorage.app",
  messagingSenderId: "539058257239",
  appId: "1:539058257239:web:97b13446f83304c6119212"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
