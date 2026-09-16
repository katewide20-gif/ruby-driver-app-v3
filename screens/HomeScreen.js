import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruby</Text>
      <Text style={styles.subtitle}>Hire a driver by the hour</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("BookDriver")}>
        <Text style={styles.buttonText}>Book a Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate("MyBookings")}>
        <Text style={styles.secondaryButtonText}>My Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={() => signOut(auth)}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 40, fontWeight: "bold", color: "#2FA8E0", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 40 },
  button: { backgroundColor: "#2FA8E0", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondaryButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#2FA8E0" },
  secondaryButtonText: { color: "#2FA8E0", fontWeight: "bold", fontSize: 16 },
  logout: { marginTop: 30, alignItems: "center" },
  logoutText: { color: "#999" }
});
