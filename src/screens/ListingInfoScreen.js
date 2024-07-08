import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Button,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { jwtDecode } from "jwt-decode";

const ListingInfoScreen = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params;

  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);

  const [id_listing, setIdListing] = useState(null);
  const [proposer_id, setProposerId] = useState(null);
  const [proposal_msg, setProposalMsg] = useState(null);

  const [isVisible, setIsVisible] = useState(true);

  const handleClickCreate = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync("userToken");

      const response = await axios.post(
        "http://192.168.1.110:8000/createProposal",
        {
          id_listing,
          proposer_id,
          proposal_msg,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data) {
        const reponse_convo = await axios.post(
          "http://192.168.1.110:8000/createConversation",
          {
            proposal_id: response.data.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (reponse_convo.data) {
          navigation.navigate("Conversation", {
            id: reponse_convo.data.id,
          });
        } else {
          console.error("Erreur lors de la création de la conversation");
        }
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        const decoded = jwtDecode(token);
        setProposerId(decoded.id);
      }
      try {
        const response = await axios.get(
          `http://192.168.1.110:8000/get_proposal_created/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'etat de l'annonce:",
          error
        );
      }
    };

    const getInfo = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.110:8000/get_listing/${id}`
        );
        setTitle(response.data.name);
        setDescription(response.data.description);
        setStartDate(response.data.start_date);
        setEndDate(response.data.end_date);
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const decoded = jwtDecode(token);
          if (response.data.id_user == decoded.id) {
            setIsVisible(false);
          }
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };

    const getImage = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.110:8000/get_image/${id}`,
          {
            responseType: "arraybuffer",
          }
        );
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageSrc(`data:image/jpeg;base64,${base64}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching image:", error);
        setLoading(false);
      }
    };

    fetchData();

    setIdListing(id);
    setProposalMsg("");
    getInfo();
    getImage();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          {imageSrc ? (
            <Image source={{ uri: imageSrc }} style={styles.image} />
          ) : null}
          <Text style={styles.text}>{description}</Text>
          <Text style={styles.text}>Du: {start_date}</Text>
          <Text style={styles.text}>Au: {end_date}</Text>
          {isVisible ? (
            <Pressable
              title="Se proposer"
              onPress={handleClickCreate}
              style={styles.button}
            >
              <Text style={styles.textButton}>Se proposer</Text>
            </Pressable>
          ) : (
            <></>
          )}
        </>
      )}
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  button: {
    marginTop: 5, // Increase the value for more space
    marginBottom: 20, // Increase the value for more space
    backgroundColor: "#977757",
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 400,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    paddingTop: 12,
  },
  textButton: {
    color: "white",
  },
});
export default ListingInfoScreen;
