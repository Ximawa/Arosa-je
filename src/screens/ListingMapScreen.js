import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Button,
} from "react-native";
import * as Location from "expo-location";
import MapComponent from "../components/MapComponent";
import axios from "axios";
import BottomNavigationBar from "../components/BottomNavigationBar";

const ListingMapScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://192.168.1.110:8000/getAddress"); // Replace with your API endpoint
      setAddresses(response.data);
      setMarkers(
        response.data.map((address) => ({
          position: [address.latitude, address.longitude],
          title: "Title", // You might want to replace this with dynamic data
          description: "Description", // Same here, consider using data from the address
        }))
      );
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleListCLick = () => {
    navigation.navigate("Listing");
  };

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  }

  useEffect(() => {
    fetchAddresses();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      setLoading(false);
    }
  }, [addresses, userLocation]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <MapComponent
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
        markers={markers}
      />
    </View>
  );
};

export default ListingMapScreen;
