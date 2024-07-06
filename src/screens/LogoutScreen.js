import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../utils/AuthProvider"; // Mettez à jour le chemin d'accès selon votre structure de fichiers

const LogoutScreen = ({ navigation }) => {
  const { logout } = useAuth();

  useEffect(() => {
    const signOut = async () => {
      await logout();
      navigation.replace("Login"); // Utilisez 'replace' pour éviter que l'utilisateur ne puisse revenir au Dashboard après la déconnexion
    };

    signOut();
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LogoutScreen;
