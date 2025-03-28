import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { logOut, onAuthStateChange } from "@/hooks/authService";
import { useRouter } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

const Index: React.FC = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [treeName, setTreeName] = useState("");
  const [treeType, setTreeType] = useState("");
  const [treeAge, setTreeAge] = useState("");
  const mapRef = React.useRef(null);

  const [user, setUser] = useState(null); // Store logged-in user

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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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

      } catch (error) {
  
        console.error("Error getting location:", error);
  
      }
    })();
  }, []);

  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true);
    let location = await Location.getCurrentPositionAsync({});
    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setUserLocation(currentLocation);
    setSelectedLocation(currentLocation);
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

  const handleAddTree = () => {
    if (!selectedLocation) return;
    setModalVisible(true); // Open modal when clicking "Add Tree"
  };

  const handleSubmitTree = () => {
    console.log("Tree added:", { name: treeName, location: selectedLocation });
    setModalVisible(false);
    setTreeName("");
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
        <Text style={styles.userName}>{userName}</Text>

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
            style={styles.map}
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

      {/* Modal for Adding Tree Details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Tree</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tree name"
              value={treeName}
              onChangeText={setTreeName}
            />
            <TextInput style={styles.input} placeholder="Tree Type" value={treeType} onChangeText={setTreeType} />
            <TextInput style={styles.input} placeholder="Tree Age (months)" value={treeAge} onChangeText={setTreeAge} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTree}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
