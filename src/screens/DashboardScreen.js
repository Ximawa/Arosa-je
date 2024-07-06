import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

export default function DashboardScreen({ navigation }) {
  const [token, setToken] = useState(null);

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      return token;
    } catch (error) {
      console.error("Erreur lors de la récupération du token", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        setToken(storedToken);
      }
    };
    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{token}</Text>
      <Button
        title="Deconnexion"
        onPress={() => navigation.navigate("Logout")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  button: {
    marginBottom: 20, // Increase the value for more space
    backgroundColor: "red",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
});
