import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";

export default function Index() {
    const [region, setRegion] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [treeName, setTreeName] = useState("");
    const [treeType, setTreeType] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    const handleMapPress = (e: MapPressEvent) => {
        if (isAdding) {
            setMarker(e.nativeEvent.coordinate);
        }
    };

    const handleConfirmLocation = () => {
        setIsAdding(false);
        setShowForm(true);
    };

    const handleSubmit = () => {
        console.log("Tree Added:", { treeName, treeType, location: marker });
        setShowForm(false);
        setTreeName("");
        setTreeType("");
    };

    return (
        <View style={{ flex: 1 }}>
            {region ? (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    onPress={handleMapPress}
                >
                    {marker && <Marker coordinate={marker} />}
                </MapView>
            ) : (
                <Text>Loading Map...</Text>
            )}

            {!isAdding && !showForm && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: [{ translateX: -50 }],
                        backgroundColor: "blue",
                        padding: 10,
                        borderRadius: 5,
                    }}
                    onPress={() => setIsAdding(true)}
                >
                    <Text style={{ color: "white" }}>Add</Text>
                </TouchableOpacity>
            )}

            {isAdding && marker && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: [{ translateX: -50 }],
                        backgroundColor: "green",
                        padding: 10,
                        borderRadius: 5,
                    }}
                    onPress={handleConfirmLocation}
                >
                    <Text style={{ color: "white" }}>Select Position</Text>
                </TouchableOpacity>
            )}

            <Modal visible={showForm} transparent={true} animationType="slide">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                        <Text>Enter Tree Details</Text>
                        <TextInput
                            placeholder="Tree Name"
                            value={treeName}
                            onChangeText={setTreeName}
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                        />
                        <TextInput
                            placeholder="Tree Type"
                            value={treeType}
                            onChangeText={setTreeType}
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                        />
                        <Button title="Add Tree" onPress={handleSubmit} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
