import React, { useContext, useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import LogoutScreen from "../screens/LogoutScreen";
import ListingScreen from "../screens/ListingScreen";
import NewListingScreen from "../screens/NewListingScreen";
import ConversationScreen from "../screens/ConversationScreen";
import ConversationListScreen from "../screens/ConversationListScreen";
import ListingInfoScreen from "../screens/ListingInfoScreen";
import GardeScreen from "../screens/GardeScreen";
import ListingMapScreen from "../screens/ListingMapScreen";
import { useAuth, AuthProvider } from "../utils/AuthProvider";

const Stack = createStackNavigator();

function MyStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // Si l'utilisateur est connecté (token présent), afficher la route Dashboard
        <>
          <Stack.Screen name="Listing" component={ListingScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="NewListing" component={NewListingScreen} />
          <Stack.Screen name="ListingInfo" component={ListingInfoScreen} />
          <Stack.Screen name="ListingMap" component={ListingMapScreen} />
          <Stack.Screen name="Garde" component={GardeScreen} />
          <Stack.Screen name="Conversation" component={ConversationScreen} />
          <Stack.Screen
            name="ConversationList"
            component={ConversationListScreen}
          />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </>
      ) : (
        // Sinon, afficher les écrans de connexion et d'inscription
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <MyStack />
      </AuthProvider>
    </NavigationContainer>
  );
}
