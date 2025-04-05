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
        const message = `
            🌿 My Green Journey 🌿
            
            📅 This Month:
            🌳 Planted: ${user.stats.thisMonth.treesPlanted}
            💧 Watered: ${user.stats.thisMonth.watered}
            🍃 Nurtured: ${user.stats.thisMonth.nurtured}
            🌱 Seeds Donated: ${user.stats.thisMonth.seedsDonated}
            
            📊 Total Stats:
            🌳 Planted: ${user.stats.total.treesPlanted}
            💧 Watered: ${user.stats.total.watered}
            🍃 Nurtured: ${user.stats.total.nurtured}
            🌱 Seeds Donated: ${user.stats.total.seedsDonated}
            
            Join me in planting trees! 🌎 #NurtureTree
            `;
    
        await Share.share({ message });
        } catch (error) {
        console.log('Error sharing:', error.message);
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
                <TouchableOpacity onPress={handleShare}>
                    <Feather name="share-2" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* Stats Section */}
    <View style={styles.statsWrapper}>
        {/* This Month */}
        <Text style={styles.statsHeader}>🌿 This Month</Text>
        <View style={styles.statsRow}>
            {renderStat("tree", "#2E8B57", user.stats.thisMonth.treesPlanted, "Planted")}
            {renderStat("watering-can", "#1E90FF", user.stats.thisMonth.watered, "Watered")}
            {renderStat("leaf", "#32CD32", user.stats.thisMonth.nurtured, "Nurtured")}
            {renderStat("seed-outline", "#FF8C00", user.stats.thisMonth.seedsDonated, "Seeds")}
        </View>

        {/* Total */}
        <Text style={styles.statsHeader}>📊 Total</Text>
        <View style={styles.statsRow}>
            {renderStat("tree", "#2E8B57", user.stats.total.treesPlanted, "Planted")}
            {renderStat("watering-can", "#1E90FF", user.stats.total.watered, "Watered")}
            {renderStat("leaf", "#32CD32", user.stats.total.nurtured, "Nurtured")}
            {renderStat("seed-outline", "#FF8C00", user.stats.total.seedsDonated, "Seeds")}
        </View>

        {/* Badges */}
        <Text style={styles.statsHeader}>🏅 Badges Earned</Text>
        <View style={styles.badgesRow}>
            <View style={styles.badgeItem}>
                <MaterialCommunityIcons name="star-circle" size={32} color="#FFD700" />
                <Text style={styles.badgeLabel}>Eco Starter</Text>
            </View>
            <View style={styles.badgeItem}>
                <MaterialCommunityIcons name="fire" size={32} color="#FF4500" />
                <Text style={styles.badgeLabel}>Tree Warrior</Text>
            </View>
            <View style={styles.badgeItem}>
                <MaterialCommunityIcons name="leaf-circle" size={32} color="#32CD32" />
                <Text style={styles.badgeLabel}>Green Hero</Text>
            </View>
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
    },statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    statItem: {
        alignItems: "center",
        width: "22%", // 4 items in a row
    },
    statNumber: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "gray",
    },
    
    badgesRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    badgeItem: {
        alignItems: "center",
        width: "30%",
    },
    badgeLabel: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 4,
        color: "#333",
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 60, 
    },
});

export default UserInfoScreen;
