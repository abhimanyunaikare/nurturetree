import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  User, 
  getAuth 
} from "firebase/auth";
import { auth } from "@/constants/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sign Up
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get User State from Firebase Instead of AsyncStorage
export const getUser = async () => {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe immediately after getting user
      resolve(user);
    });
  });
};

// Log In
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Log Out
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Listen to Auth State Changes (Single Subscription)
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
