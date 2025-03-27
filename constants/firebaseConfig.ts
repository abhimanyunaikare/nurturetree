// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjkNxyBv2ns9NZQ1wwyoCWtBOhE3crj7I",
  authDomain: "nurture-tree-app.firebaseapp.com",
  projectId: "nurture-tree-app",
  storageBucket: "nurture-tree-app.firebasestorage.com",
  messagingSenderId: "60470413144",
  appId: "1:60470413144:web:aaf56f52cb1ac4d260472d",
  measurementId: "G-J0B8XQY57Y"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence (for React Native)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Analytics (only if supported)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.log("Firebase Analytics is not supported on this platform.");
  }
});

// Export Firebase instances
export { app, auth, analytics };