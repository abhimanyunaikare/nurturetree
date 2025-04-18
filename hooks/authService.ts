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
export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      // Send user data to Laravel API
      const response = await fetch("http://192.168.57.131:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });

      if (!response.ok) throw new Error("Failed to save user in database");

      const savedUser = await response.json();

      const newUser = { id: savedUser.user.id, name: savedUser.user.name, email };


      await AsyncStorage.removeItem("user");
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      console.log(newUser);

      return newUser;
    }
    catch (error) {
      console.log(error);

    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getStoredUser = async () => {
  const userData = await AsyncStorage.getItem("user");
  console.log("loged user:");
  console.log(userData);
  return userData ? JSON.parse(userData) : null;
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
    const user = userCredential.user;

    try {

      var url = 'http://192.168.57.131:8000/api/user?email=' + email;
      const response = await fetch(url);

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const userData = await response.json();
        console.log('user =', userData);

        if (userData.success) {
          const loggedUser = { id: userData.user.id, name: userData.user.name, email };
          console.log("Stored user:", loggedUser); // <-- Add this line

          await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
          return loggedUser;
        } else {
          console.error("User data fetch failed"); // <-- Add this line
          throw new Error("User data fetch failed");
        }
      } else {
        // Handle errors gracefully
        console.error('Error:', response.status, response.statusText);
        const errorText = await response.text(); // Read response as text (HTML or plain text)
        console.error('Error response body:', errorText);
      }
    }
    catch (error) {
      console.log(error);

      // if (userData.success) {
      //   const loggedUser = { id: userData.user.id, name: userData.user.name, email };

      //   await AsyncStorage.setItem("user", JSON.stringify(loggedUser));

      //   console.log("User logged in: ", loggedUser);
      //   return loggedUser;
      // } else {
      //   console.log("User data fetch failed");

      //   throw new Error("User data fetch failed");
      // }
    }

  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Log Out
export const logOut = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("user");

    console.log("User logged out");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Listen to Auth State Changes (Single Subscription)
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
