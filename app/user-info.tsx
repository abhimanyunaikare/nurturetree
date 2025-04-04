import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Share, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


const UserInfoScreen = () => {
    const router = useRouter();

    // Mock user data (replace with API data)
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        stats: {
            thisMonth: { treesPlanted: 5, watered: 10, nurtured: 4, seedsDonated: 20 },
            total: { treesPlanted: 15, watered: 30, nurtured: 10, seedsDonated: 50 },
        },
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I've planted ${user.stats.treesPlanted} trees! Join me in nurturing nature! 🌱`,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (

        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="white"/>
                </TouchableOpacity>
                <Text style={styles.headerText}>User Info</Text>
                <TouchableOpacity>
                    <Feather name="share-2" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* User Details */}
                <View style={styles.userInfo}>
                    <MaterialCommunityIcons name="account-circle" size={80} color="#008CBA" />
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>

                {/* User Statistics
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="tree" size={30} color="#2E8B57" />
                        <Text style={styles.statNumber}>{user.stats.treesPlanted}</Text>
                        <Text style={styles.statLabel}>Planted</Text>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="watering-can" size={30} color="#1E90FF" />
                        <Text style={styles.statNumber}>{user.stats.watered}</Text>
                        <Text style={styles.statLabel}>Watered</Text>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="leaf" size={30} color="#32CD32" />
                        <Text style={styles.statNumber}>{user.stats.nurtured}</Text>
                        <Text style={styles.statLabel}>Nurtured</Text>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="seed-outline" size={30} color="#FF8C00" />
                        <Text style={styles.statNumber}>{user.stats.seedsDonated}</Text>
                        <Text style={styles.statLabel}>Seeds Donated</Text>
                    </View>
                </View> */}

                {/* Stats Section */}
                <View style={styles.statsWrapper}>
                    {/* This Month Stats */}
                    <Text style={styles.statsHeader}>🌿 This Month</Text>
                    <View style={styles.statsContainer}>
                        {renderStat("tree", "#2E8B57", user.stats.thisMonth.treesPlanted, "Planted")}
                        {renderStat("watering-can", "#1E90FF", user.stats.thisMonth.watered, "Watered")}
                        {renderStat("leaf", "#32CD32", user.stats.thisMonth.nurtured, "Nurtured")}
                        {renderStat("seed-outline", "#FF8C00", user.stats.thisMonth.seedsDonated, "Seeds")}
                    </View>

                    {/* Total Stats */}
                    <Text style={styles.statsHeader}>📊 Total</Text>
                    <View style={styles.statsContainer}>
                        {renderStat("tree", "#2E8B57", user.stats.total.treesPlanted, "Planted")}
                        {renderStat("watering-can", "#1E90FF", user.stats.total.watered, "Watered")}
                        {renderStat("leaf", "#32CD32", user.stats.total.nurtured, "Nurtured")}
                        {renderStat("seed-outline", "#FF8C00", user.stats.total.seedsDonated, "Seeds")}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Helper function to render stats
const renderStat = (icon: string, color: string, count: number, label: string) => (
    <View style={styles.statItem}>
        <MaterialCommunityIcons name={icon} size={30} color={color} />
        <Text style={styles.statNumber}>{count}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#2fff", borderRadius: 10 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "rgba(40, 167, 69, 0.8)", // Semi-transparent header
        padding: 15,
    },
    headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
    backButton: {
        position: 'absolute',
        top: 50, // Adjust for your header
        left: 20,
        padding: 10,
        
    }, 
    icon: {
        padding: 10,
    },
    userInfo: {
        alignItems: "center",
        marginVertical: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
    },
    userEmail: {
        fontSize: 16,
        color: "gray",
    },
    statsWrapper: {
        paddingHorizontal: 20,
    },
    statsHeader: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 10,
        textAlign: "center",
    },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
        width: "45%",
        padding: 15,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        marginBottom: 15,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
    },
    statLabel: {
        fontSize: 14,
        color: "gray",
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 60, 
    },
});

export default UserInfoScreen;
