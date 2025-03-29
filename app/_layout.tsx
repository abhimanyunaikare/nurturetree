import { Stack, useRouter, useSegments } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChange, getStoredUser } from "@/hooks/authService";   
import AsyncStorage from "@react-native-async-storage/async-storage";


import { User } from "firebase/auth";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments(); // Get current navigation segments
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track auth state
  const [redirecting, setRedirecting] = useState(false); // Prevent multiple redirects

  useEffect(() => {
    // Load user from AsyncStorage first
    const loadStoredUser = async () => {
      const storedUser = await getStoredUser();
      if (storedUser) {
        setUser(storedUser); // Set user immediately if available
      }
    };

    loadStoredUser();

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        const storedUser = await getStoredUser();
        setUser(storedUser || authUser); // Prefer stored user with extra details
      } else {
        await AsyncStorage.removeItem("user");
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || redirecting) return; // Avoid looping
  
    const isAuthPage = segments[0] === "auth";
  
    if (!user && !isAuthPage) {
      setRedirecting(true);
      router.replace("/auth");
    } else if (user && isAuthPage) {
      setRedirecting(true);
      router.replace("/");
    }
  
    setRedirecting(false); // Reset flag after redirection
  }, [user, loading]);

  // Show a loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {/* Debugging: Display auth state */}
      {/* <Text style={{ textAlign: "center", padding: 10, backgroundColor: "#eee" }}>
        {user ? `Logged in as: ${user.email}` : "Not Logged In"}
      </Text> */}
    </View>
  );
}
