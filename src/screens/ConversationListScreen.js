import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { jwtDecode } from "jwt-decode";

const ConversationListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync("userToken");
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        var userId = decoded.id;
      }
      const response = await axios.get(
        `http://192.168.1.110:8000/conversation/user/${userId}`
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handlePressConversation = (id) => {
    navigation.navigate("Conversation", { id });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Return true to indicate that the back press has been handled
    );

    // Set navigation options to hide the back arrow
    navigation.setOptions({
      headerLeft: () => null,
    });

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handlePressConversation(item.conversation_id)}
          >
            <Text style={styles.conversationText}>{item.message}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  conversationItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  conversationText: {
    fontSize: 16,
  },
});

export default ConversationListScreen;
