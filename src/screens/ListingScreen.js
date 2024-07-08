import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import ListingCard from "../components/ListingCard";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { ScrollView } from "react-native-gesture-handler";

const ListingScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = async () => {
    setRefreshing(true);
    try {
      const jwtToken = await SecureStore.getItemAsync("userToken");
      const response = await axios.get("http://192.168.1.110:8000/listing", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setListings(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const onRefresh = () => {
    fetchListings();
  };

  const handleCardClick = (id) => {
    navigation.navigate("ListingInfo", { id: id });
  };

  const handleMapClick = () => {
    navigation.navigate("ListingMap");
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Liste des annonces</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={onRefresh} style={styles.button}>
          <Text style={styles.text}>Refresh</Text>
        </Pressable>
        <Pressable onPress={handleMapClick} style={styles.button}>
          <Text style={styles.text}>Voir la carte</Text>
        </Pressable>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {listings.map(({ id, name, start_date, end_date }) => (
          <ListingCard
            key={id}
            id={id}
            name={name}
            start_date={start_date}
            end_date={end_date}
            onClick={handleCardClick}
          >
            <Text>Voir plus</Text>
          </ListingCard>
        ))}
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#3B543B",
  },
  text: {
    color: "white",
  },
});

export default ListingScreen;
