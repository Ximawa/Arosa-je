import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { decodeJwtPayload } from "../utils/JwtUtils";
import axios from "axios";
import BottomNavigationBar from "../components/BottomNavigationBar";

const ConversationScreen = (navigation) => {
  const route = useRoute();
  const { id } = route.params;
  const [conversation, setConversation] = useState([]);
  const [userId, setUserId] = useState(null);
  const [messageText, setMessageText] = useState(""); // State for input field text

  const fetchConversation = async () => {
    const jwtToken = await SecureStore.getItemAsync("userToken");
    const jwtData = decodeJwtPayload(jwtToken);
    if (jwtData) {
      setUserId(jwtData.id);
    }
    try {
      const response = await axios.get(
        `http://192.168.1.110:8000/conversation/${id}`
      );
      setConversation(response.data);
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    }
  };

  useEffect(() => {
    fetchConversation();
    console.log("ConversationScreen mounted");
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwtToken = await SecureStore.getItemAsync("userToken");
    const jwtData = decodeJwtPayload(jwtToken);
    if (jwtData) {
      setUserId(jwtData.id);
    }
    try {
      const response = await axios.post(
        `http://192.168.1.110:8000/addMessage/`,
        {
          conversation_id: id,
          sender_id: userId,
          message: messageText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setMessageText("");
    } catch (error) {
      console.error("Error during axios post request:", error);
      // Handle error
    }

    fetchConversation();
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {conversation.map((message, index) => (
          <View
            key={index}
            style={
              message.sender_id === userId
                ? styles.currentUserMessage
                : styles.otherUserMessage
            }
          >
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSubmit} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    margin: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 10,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    margin: 10,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  messageText: {
    color: "white",
  },
});

export default ConversationScreen;
