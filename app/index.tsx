import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { logOut, getUser } from "@/hooks/authService";
import LoadingScreen from "./LoadingScreen";
import { View, Text, Button } from "react-native";

export default function Index() {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            const firebaseUser = await getUser();
            if (isMounted) {
                console.log("Auth state changed:", firebaseUser);
                setUser(firebaseUser);
                setIsLoading(false);
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        await logOut();
        router.replace("/auth");
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Welcome {user?.email || "Guest"}</Text>
            {user && <Button title="Logout" onPress={handleLogout} />}
        </View>
    );
}
