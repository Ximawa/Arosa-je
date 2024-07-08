import React from "react";
import { View, Button, StyleSheet, Pressable, Text } from "react-native";

const BottomNavigationBar = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => navigation.navigate("Listing")}>
        <View style={styles.button}>
          <Text style={styles.text}>Annonces</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Garde")}>
        <View style={styles.button}>
          <Text style={styles.text}>Mes gardes</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("NewListing")}>
        <View style={styles.button}>
          <Text style={styles.text}>Ajouter</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("ConversationList")}>
        <View style={styles.button}>
          <Text style={styles.text}>Messages</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Logout")}>
        <View style={styles.button}>
          <Text style={styles.text}>Deconnexion</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#977757",
    padding: 10,
    paddingBottom: 30,
  },
  text: {
    color: "white",
  },
});

export default BottomNavigationBar;
