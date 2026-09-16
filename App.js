import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { View, ActivityIndicator } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import BookDriverScreen from "./screens/BookDriverScreen";
import MyBookingsScreen from "./screens/MyBookingsScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2FA8E0" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#2FA8E0" }, headerTintColor: "#fff" }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Ruby" }} />
            <Stack.Screen name="BookDriver" component={BookDriverScreen} options={{ title: "Book a Driver" }} />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: "My Bookings" }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
