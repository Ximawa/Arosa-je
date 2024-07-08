import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import ListingCard from "../components/ListingCard"; // Ensure ListingCard is adapted for React Native
import BottomNavigationBar from "../components/BottomNavigationBar"; // Ensure this is adapted for React Native
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const GardeScreen = ({ navigation }) => {
  const [idUser, setIdUser] = useState(null);
  const [activeGardes, setActiveGardes] = useState(null);
  const [showActiveGardes, setShowActive] = useState(false);
  const [pastGardes, setPastGardes] = useState(null);
  const [showPastGardes, setShowPastGardes] = useState(false);

  // Function to fetch active gardes
  const fetchActiveGardes = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        const decoded = jwtDecode(token);
        var idUser = decoded.id;
      }
      const response = await fetch(
        `http://192.168.1.110:8000/getProposal/active/${idUser}`
      );
      const data = await response.json();
      setActiveGardes(data);
      setActiveGardes(true);
    } catch (error) {
      console.error("Failed to fetch active gardes:", error);
    }
  };

  // Function to fetch past gardes
  const fetchPastGardes = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      const decoded = jwtDecode(token);
      var idUser = decoded.id;
    }
    try {
      const response = await fetch(
        `http://192.168.1.110:8000/getProposal/inactive/${idUser}`
      );
      const data = await response.json();
      setPastGardes(data);
      setShowPastGardes(true);
    } catch (error) {
      console.error("Failed to fetch past gardes:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchActiveGardes();
    fetchPastGardes();
  }, []);

  return (
    <>
      <ScrollView>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 20,
            marginLeft: 10,
          }}
        >
          Active Gardes
        </Text>
        <View>
          {showActiveGardes &&
            activeGardes.map((garde) => (
              <ListingCard
                key={garde.id}
                id={garde.id}
                name={garde.name}
                start_date={garde.start_date}
                end_date={garde.end_date}
                //onClick={handleCardClick}
              />
            ))}
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 20,
            marginLeft: 10,
          }}
        >
          Past Gardes
        </Text>
        <View>
          {showPastGardes &&
            pastGardes.map((garde) => (
              <ListingCard
                key={garde.id}
                id={garde.id}
                name={garde.name}
                start_date={garde.start_date}
                end_date={garde.end_date}
              />
            ))}
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </>
  );
};

export default GardeScreen;
