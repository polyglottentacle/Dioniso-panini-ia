import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth, Auth, GoogleAuthProvider,
  signInWithRedirect, getRedirectResult, signOut,
  onAuthStateChanged, User as FirebaseUser,
} from "firebase/auth";

// Only initialise Firebase when credentials are present (local dev without
// Firebase config should not crash the whole React app).
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;

if (apiKey) {
  _app = initializeApp({
    apiKey,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  });
  _auth = getAuth(_app);
}

export const auth: Auth | undefined = _auth;
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!_auth) { console.warn("Firebase not configured"); return; }
  await signInWithRedirect(_auth, googleProvider);
};

export const handleRedirectResult = async () => {
  if (!_auth) return null;
  try {
    const result = await getRedirectResult(_auth);
    return result?.user ?? null;
  } catch (error) {
    console.error("Errore durante il login:", error);
    return null;
  }
};

export const logoutUser = async () => {
  if (!_auth) return;
  await signOut(_auth);
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  if (!_auth) return Promise.resolve(null);
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(_auth!, (user) => { unsub(); resolve(user); });
  });
};

export default _app;
