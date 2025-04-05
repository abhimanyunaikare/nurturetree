import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ManageRemindersScreen = () => {
    const router = useRouter();
    const [reminders, setReminders] = useState([]);

    useEffect(() => {   
        const loadReminders = async () => {
        const stored = await AsyncStorage.getItem('treeReminders');
        const parsed = stored ? JSON.parse(stored) : [];
        setReminders(parsed);
        };

        loadReminders();
    }, []);

    const cancelReminder = async (id: string) => {
        await Notifications.cancelScheduledNotificationAsync(id);
        const updated = reminders.filter(r => r.notificationId !== id);
        setReminders(updated);
        await AsyncStorage.setItem('treeReminders', JSON.stringify(updated));
    };

    const confirmCancel = (id: string) => {
        Alert.alert("Cancel Reminder", "Are you sure you want to cancel this reminder?", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => cancelReminder(id) }
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                <Feather name="bell" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Reminders</Text>
            </View>
        
            {/* Content */}
            <View style={styles.container}>
                <FlatList
                data={reminders}
                keyExtractor={(item, index) => item.notificationId || index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                    <Text>🌱 {item.treeName}</Text>
                    <Text>Interval: {item.interval} days</Text>
                    <Text>Next: {new Date(item.nextTrigger).toLocaleString()}</Text>
                    <TouchableOpacity onPress={() => confirmCancel(item.notificationId)}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                )}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                    if (router.canGoBack?.()) {
                        router.back();
                    } else {
                        router.replace("/");
                    }
                    }}
                >
                    <Feather name="arrow-left" size={18} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
      
};

export default ManageRemindersScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    item: { marginBottom: 15, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 10 },
    cancel: { color: 'red', marginTop: 10 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "rgba(40, 167, 69, 0.8)", // Semi-transparent header
        padding: 15,
    },
    headerText: { color: "white", fontSize: 20, fontWeight: "bold",
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center'
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',         
        alignItems: 'center',         
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        elevation: 2,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
