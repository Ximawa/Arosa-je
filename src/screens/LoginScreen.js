import React, { useState } from "react";
import axios from "axios";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useAuth } from "../utils/AuthProvider";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://192.168.1.110:8000/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { access_token } = response.data;

      if (response.status !== 200) {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
        return;
      } else {
        login(access_token);
      }
    } catch (error) {
      setError("Erreur lors de la connexion. Veuillez réessayer.");
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Se connecter"
        onPress={handleLogin}
        style={styles.button}
      />
      <Button
        title="Creer un compte"
        onPress={() => navigation.navigate("Signup")}
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
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  button: {
    marginBottom: 20, // Increase the value for more space
    backgroundColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
