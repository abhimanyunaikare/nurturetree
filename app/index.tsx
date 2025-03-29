        import React, { useState, useEffect, useRef  } from "react";
        import {
        View,
        Text,
        TouchableOpacity,
        StyleSheet,
        ActivityIndicator,
        Modal,
        TextInput,
        Alert
        } from "react-native";
        import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
        import * as Location from "expo-location";
        import { logOut, onAuthStateChange , getStoredUser} from "@/hooks/authService";
        import { useRouter } from "expo-router";
        import { Feather, FontAwesome5 } from "@expo/vector-icons";
        import { Picker } from '@react-native-picker/picker';
        import Icon from "react-native-vector-icons/MaterialCommunityIcons";

        import { Circle } from 'react-native-maps';


        const Index: React.FC = () => {
            const router = useRouter();
            const [selectedLocation, setSelectedLocation] = useState(null);
            const [userLocation, setUserLocation] = useState(null);
            const [loadingLocation, setLoadingLocation] = useState(false);
            const [addTreeModalVisible, setAddTreeModalVisible] = useState(false);
            const [treeDetailsModalVisible, setTreeDetailsModalVisible] = useState(false);
            const [treeName, setTreeName] = useState("");
            const [treeType, setTreeType] = useState("");
            const [treeAge, setTreeAge] = useState("");
            const [latitude, setLatitude] = useState("");
            const [longitude, setLongitude] = useState("");
            const [interval, setInterval] = useState("");
            const [sunlight, setSunlight] = useState("");
            const [water_qty, setWaterqty] = useState("");
            const [selectedTree, setSelectedTree] = useState(null);
            const [createdBy, setCreatedBy] = useState(1);

            const mapRef = React.useRef(null);
            const [trees, setTrees] = useState([]); // Store trees fetched from API

            const [user, setUser] = useState<{ id: number; name: string } | null>(null);

            const [region, setRegion] = useState({
                latitude: 20.5937,
                longitude: 78.9629,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            // Simulated user data
            const userName = "John Doe";
            const treesPlanted = 15;
            const treesNeedingHelp = 3;

            useEffect(() => {
                const fetchUser = async () => {
                const storedUser = await getStoredUser();
                setUser(storedUser);
                console.log(storedUser);
                };
                fetchUser();
            }, []);

            useEffect(() => {
                if (user) {
                    setCreatedBy(user.id);
                }
            }, [user]);  // Updates state when user changes

            useEffect(() => {
                if (selectedLocation) {
                    setLatitude(selectedLocation.latitude.toString());
                    setLongitude(selectedLocation.longitude.toString());
                }
            }, [selectedLocation]); // Runs whenever `selectedLocation` changes
            
            useEffect(() => {
                (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Location permission is required.");
                    return;
                }
                try {

                    let location = await Location.getCurrentPositionAsync({});  
                    const currentLocation = {  
                    latitude: location.coords.latitude,  
                    longitude: location.coords.longitude,  
                    };
            
                    setUserLocation(currentLocation);  
                    setSelectedLocation(currentLocation);  
                    setRegion({ ...currentLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 });  
                    setLatitude(currentLocation.latitude.toString());
                    setLongitude(currentLocation.longitude.toString());
                    
                    // Fetch trees when location is available
                    fetchTrees();

                } catch (error) {
            
                    console.error("Error getting location:", error);
            
                }
                })();
            }, []);

            const fetchTrees = async () => {
                try {
                    const response = await fetch("http://192.168.161.131:8000/api/trees");
                    const jsonResponse = await response.json();

                    if (jsonResponse.success && Array.isArray(jsonResponse.data.data)) {
                        setTrees(jsonResponse.data.data); // Extract the nested data array
                    } else {
                        console.error("Unexpected API response:", jsonResponse);
                        setTrees([]); // Default to an empty array
                    }
                } catch (error) {
                console.error("Error fetching trees:", error);
                setTrees([]); // Prevent undefined errors
                }
            };

            const handleMarkerPress = (tree) => {
                setSelectedTree(tree);
                setTreeDetailsModalVisible(true);
            };

            const handleGetCurrentLocation = async () => {
                setLoadingLocation(true);
                let location = await Location.getCurrentPositionAsync({});
                const currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                };
                setUserLocation(currentLocation);
                setSelectedLocation(currentLocation);
                setLatitude(currentLocation.latitude.toString());
                setLongitude(currentLocation.longitude.toString());
                setLoadingLocation(false);


                // Animate map to new location
                if (mapRef.current) {
                mapRef.current.animateToRegion({
                    ...currentLocation,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                }
            };


            const handleWaterTree = async (treeId) => {

                Alert.alert("Water Tree", "Are you sure you want to water this tree?", [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.161.131:8000/api/trees/${treeId}/nurture`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    tree_id: treeId, 
                                    watered_by: user? user.id : 1,  // Replace with actual user ID or name
                                }),
                            });
                            if (response.ok) {
                                Alert.alert("Success", "Tree watered successfully!");
                                fetchTrees();
                                setAddTreeModalVisible(false);                    
                            } else {
                                console.error(response);
                                Alert.alert("Error", `Failed to water the tree ${treeId}.`);
                            }
                    } catch (error) {
                        Alert.alert("Error", "Could not connect to server." + error);
                    }
                    },
                },
                ]);
            };
        
            const handleAddTree = () => {
                if (!selectedLocation) return;
                setAddTreeModalVisible(true);
            };

            const handleSubmitTree = async() => {
                if (!selectedLocation || !treeName || !treeType) {
                    Alert.alert("Error", "Please fill in all fields and select a location.");
                    return;
                }
                const treeData = {
                    name: treeName,  
                    species: treeType,  
                    age: treeAge,  
                    lat: selectedLocation.latitude.toString(),  
                    long: selectedLocation.longitude.toString(),  
                    interval: interval ? interval : 1,  
                    sunlight: sunlight ? sunlight : 'Full Sun',  
                    water_qty: water_qty ? water_qty : '500ml',  
                    created_by: createdBy ? createdBy : user.id,  
                };
            
                try {  
                    console.log(treeData);
                    const response = await fetch("http://192.168.161.131:8000/api/trees", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify(treeData),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        Alert.alert("Success", "Tree added successfully!");
                        setAddTreeModalVisible(false);
                        setTreeName("");
                        setTreeType("");
                        setTreeAge("");
                        setInterval("");

                    } else {

                        Alert.alert("Error", data.message || "Failed to add tree.");

                    }
            
                } catch (error) {
                    Alert.alert("Error", "Could not connect to server."+error);
                }
            
            };

        return (
            <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Plant a Tree</Text>
                <TouchableOpacity onPress={logOut}>
                <Feather name="log-out" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Floating User Info */}
            <View style={styles.userInfo}>
            <Text>Welcome {user ? user.name : "Guest"}!</Text>

                <TouchableOpacity style={styles.statItem} onPress={() => router.push("/")}>
                <FontAwesome5 name="seedling" size={18} color="green" />
                <Text style={styles.statText}>{treesPlanted}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.statItem} onPress={() => router.push("/")}>
                <FontAwesome5 name="exclamation-circle" size={18} color="red" />
                <Text style={styles.statText}>{treesNeedingHelp}</Text>
                </TouchableOpacity>
            </View>

                {/* Map View */}
                <MapView style={styles.map} region={region}
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: userLocation?.latitude || 20.5937,
                        longitude: userLocation?.longitude || 78.9629,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={(e) => {
                    setSelectedLocation(e.nativeEvent.coordinate);
                    }}
                >
                {selectedLocation && <Marker coordinate={selectedLocation} />}

                {trees.map((tree, index) => (

                <Marker
                    key={index}
                    coordinate={{ latitude: parseFloat(tree.lat), longitude: parseFloat(tree.long) }}
                    pinColor="green"
                    title={tree.name || "Tree"}
                    description={`Type: ${tree.species}`}
                    onPress={() => handleMarkerPress(tree)}
                />

                ))}

                {/* {trees.map((tree, index) => (
                            <Circle
                                key={index}
                                center={{ 
                                    latitude: parseFloat(tree.lat), 
                                    longitude: parseFloat(tree.long) 
                                }}
                                radius={13} // Small dot effect
                                strokeColor="transparent" // No border
                                fillColor="green" // Dot color
                            />
                        ))} */}
            </MapView>

            {/* Get Current Location Button */}
            <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation}>
                {loadingLocation ? (
                <ActivityIndicator size="small" color="white" />
                ) : (
                <Feather name="crosshair" size={24} color="white" />
                )}
            </TouchableOpacity>

            {/* Add Tree Button */}
            <TouchableOpacity style={styles.addTreeButton} onPress={handleAddTree}>
                <Text style={styles.buttonText}>Add Tree</Text>
            </TouchableOpacity>

                {/* Tree Info Modal */}

                <Modal animationType="slide" transparent={true}  visible={treeDetailsModalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {selectedTree && (
                                <>

                                <Text style={styles.modalTitle}>{selectedTree.name || "Tree Details"}</Text>
                                <Text>Type: {selectedTree.species}</Text>
                                <Text>Age: {selectedTree.age || "Unknown"}</Text>
                                <Text>Location: {selectedTree.lat}, {selectedTree.long}</Text>

                                <TouchableOpacity
                                    style={styles.waterButton}
                                    onPress={() => handleWaterTree(selectedTree.id)}
                                >
                                    <Text style={styles.buttonText}>Water the Tree</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setTreeDetailsModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>

                                </>
                            )}

                        </View>
                    </View>
                </Modal>

            {/* Modal for Adding Tree Details */}
            <Modal visible={addTreeModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add a Tree</Text>
                    <View style={styles.inputContainer2}>
                        <Icon name="account-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                        style={styles.input}
                        placeholder="Enter tree name (optional)"
                        value={treeName}
                        onChangeText={setTreeName}
                        />
                    </View>
                    <View style={styles.inputContainer2}>
                        <Icon name="tree-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Tree Type (specimen)" value={treeType} onChangeText={setTreeType} />
                    </View>
                    <View style={styles.inputContainer2}>
                        <Icon name="calendar-clock" size={20} color="#666" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Tree Age (days)" value={treeAge} onChangeText={setTreeAge} keyboardType="numeric" />
                    </View>
                    <View style={styles.inputContainer2}>
                        <Icon name="map-marker" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Latitude"
                            value={latitude}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer2}>
                        <Icon name="map-marker-radius" size={20} color="#666" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Longitude" value={longitude} editable={false} />
                    </View>
                    <View style={styles.inputContainer2}>
                        <Icon name="account-cowboy-hat-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="createdBy" value={user ? user.id.toString() : 1} editable={false} />
                    </View>
                    {/* Interval for Watering Plant Dropdown */}
                    <View style={styles.inputContainer}>
                        <View style={styles.labelContainer}>
                            <Icon name="timer-sand" size={20} color="#666" style={styles.icon2} />
                            <Text style={styles.label}>Watering Interval :</Text>
                        </View>
                        <View style={styles.pickerWrapper}>
                            <Picker
                            selectedValue={interval}
                            onValueChange={(itemValue) => {
                                console.log("Interval Changed:", itemValue);
                                setInterval(itemValue);
                            }}
                            style={styles.picker}
                            mode="dropdown"
                            >
                            <Picker.Item label="Daily" value="1" />
                            <Picker.Item label="Every 3 Days" value="3" />
                            <Picker.Item label="Weekly" value="7" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.labelContainer}>
                            <Icon name="weather-sunny" size={20} color="#666" style={styles.icon2} />
                            <Text style={styles.label}>Sunlight Requirement :</Text>
                        </View>
                        <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={sunlight}
                            onValueChange={(itemValue) => setSunlight(itemValue)}
                            style={styles.picker}
                            >
                            <Picker.Item label="Full Sun" value="full_sun" />
                            <Picker.Item label="Partial Shade" value="partial_shade" />
                            <Picker.Item label="Low Light" value="low_light" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.labelContainer}>
                            <Icon name="water-outline" size={20} color="#666" style={styles.icon2} />
                            <Text style={styles.label}>Water Quantity :</Text>
                        </View>
                        <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={water_qty}
                            onValueChange={(itemValue) => setWaterqty(itemValue)}
                            style={styles.picker}
                            >
                            <Picker.Item label="500ml" value="500ml" />
                            <Picker.Item label="1 Liter" value="1L" />
                            <Picker.Item label="2 Liters" value="2L" />
                        </Picker>
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTree}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setAddTreeModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
            </View>
        );
        };

        const styles = StyleSheet.create({
            container: { flex: 1 },
            inputContainer: {
                marginBottom: 8,
                width: "100%",
            },
            inputContainer2: {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 1,
            },
            labelContainer: {
                flexDirection: 'row', // Arrange items in a row
                alignItems: 'center', // Align them vertically in the center
                marginBottom: 8, // Add some spacing if needed
            },
            icon: {
                marginRight: 3,
                marginBottom:5
            }, 
            icon2: {
                marginRight: 3
            },            
            label: {
                fontSize: 14,
                color: "#444",
                //marginLeft: 2,
            },
            pickerWrapper: {
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                backgroundColor: "#fff",
                width: "100%",
                height: 40
            },
            picker: {
                fontSize: 10,
                marginTop:-8,
                color: "#333",                
            },
            waterButton: {
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
            },
            closeButton: {
                backgroundColor: "red",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
            },
            header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(40, 167, 69, 0.8)", // Semi-transparent header
                padding: 15,
            },
            headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
            map: { flex: 1 },
            userInfo: {
                position: "absolute",
                top: 80,
                left: 10,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                zIndex: 10,
                elevation: 5,
            },
            userName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
            statItem: { flexDirection: "row", alignItems: "center", padding: 5 },
            statText: { fontSize: 16, marginLeft: 5, fontWeight: "bold" },
            locationButton: {
                position: "absolute",
                bottom: 140,
                right: 20,
                backgroundColor: "#28a745",
                padding: 12,
                borderRadius: 30,
            },
            addTreeButton: {
                position: "absolute",
                bottom: 60,
                left: "50%",
                transform: [{ translateX: -50 }],
                backgroundColor: "#007bff",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
            },
            buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
            modalContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
            },
            modalContent: {
                width: "80%",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
            },
            modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
            input: {
                width: "100%",
                padding: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                marginBottom: 10,
            },
            modalButtons: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
            submitButton: { flex: 1, backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginRight: 5 },
            cancelButton: { flex: 1, backgroundColor: "red", padding: 10, borderRadius: 5, marginLeft: 5 },
        });

        export default Index;
