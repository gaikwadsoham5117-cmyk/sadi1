import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBit82xpHX4gYml3KQOYwcKA-5k-k9VHE4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sareeshop-2edcf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sareeshop-2edcf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sareeshop-2edcf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "14162599127",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:14162599127:web:251c44a12ae1f7fef2a492"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { User };
